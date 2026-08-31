"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/products";
import { alertFailure, alertProgress, alertSuccess } from "@/lib/alert";
import { resolveSuggestionProduct, isDummySuggestionSlug } from "@/lib/cart-suggestions";

export type CartItem = {
  slug: string;
  qty: number;
};

type ShopStoreValue = {
  catalog: Product[];
  collections: string[];
  catalogSource: "woo" | "demo" | null;
  catalogError: string | null;
  catalogReady: boolean;
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  cartProducts: { product: Product; qty: number }[];
  wishlistProducts: Product[];
  cartPanelOpen: boolean;
  cartPanelProductSlug: string | null;
  cartBarOpen: boolean;
  getCatalogProduct: (slug: string) => Product | undefined;
  addToCart: (slug: string, qty?: number) => void;
  openCartPanel: (slug?: string) => void;
  closeCartPanel: () => void;
  hideCartBar: () => void;
  setQty: (slug: string, qty: number, opts?: { silent?: boolean }) => void;
  removeFromCart: (slug: string) => void;
  clearCart: (opts?: { silent?: boolean }) => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  ready: boolean;
};

const ShopStoreContext = createContext<ShopStoreValue | null>(null);

const CART_KEY = "global-fruits-cart";
const WISH_KEY = "global-fruits-wishlist";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function ShopStoreProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [collections, setCollections] = useState<string[]>(["All"]);
  const [catalogSource, setCatalogSource] = useState<"woo" | "demo" | null>(
    null,
  );
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogReady, setCatalogReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartPanelOpen, setCartPanelOpen] = useState(false);
  const [cartPanelProductSlug, setCartPanelProductSlug] = useState<string | null>(
    null,
  );
  const [cartBarOpen, setCartBarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readJson<CartItem[]>(CART_KEY, []));
    setWishlist(readJson<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = (await res.json()) as {
          products?: Product[];
          collections?: string[];
          source?: "woo" | "demo";
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || "Failed to load catalog");
        }
        if (!cancelled) {
          setCatalog(data.products ?? []);
          setCollections(data.collections ?? ["All"]);
          setCatalogSource(data.source ?? null);
          setCatalogError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setCatalog([]);
          setCollections(["All"]);
          setCatalogSource(null);
          const message =
            err instanceof Error ? err.message : "Failed to load products";
          setCatalogError(message);
          alertFailure("Couldn’t load products. Please try again.");
        }
      } finally {
        if (!cancelled) setCatalogReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (cart.length === 0) setCartBarOpen(false);
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const resolveProduct = useCallback(
    (slug: string): Product | undefined => {
      const fromCatalog = catalog.find((p) => p.slug === slug);
      if (fromCatalog) return fromCatalog;
      // Dummy fallback only for items added while catalog was empty
      if (isDummySuggestionSlug(slug)) return resolveSuggestionProduct(slug);
      return undefined;
    },
    [catalog],
  );

  const getCatalogProduct = useCallback(
    (slug: string) => resolveProduct(slug),
    [resolveProduct],
  );

  const openCartPanel = useCallback((slug?: string) => {
    if (slug) setCartPanelProductSlug(slug);
    setCartPanelOpen(true);
  }, []);

  const closeCartPanel = useCallback(() => {
    setCartPanelOpen(false);
  }, []);

  const hideCartBar = useCallback(() => {
    setCartBarOpen(false);
  }, []);

  const addToCart = useCallback(
    (slug: string, qty = 1) => {
      const product = resolveProduct(slug);
      if (!product) {
        alertFailure("Couldn’t add to cart. Product unavailable.");
        return;
      }

      setCart((prev) => {
        const existing = prev.find((i) => i.slug === slug);
        if (existing) {
          return prev.map((i) =>
            i.slug === slug ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [...prev, { slug, qty }];
      });
      setCartPanelProductSlug(slug);
      setCartBarOpen(true);
    },
    [resolveProduct],
  );

  const setQty = useCallback(
    (slug: string, qty: number, opts?: { silent?: boolean }) => {
      const product = resolveProduct(slug);
      const name = product?.name ?? "item";
      const inCart = cart.some((i) => i.slug === slug);

      if (!inCart) {
        if (!opts?.silent) {
          alertFailure("Couldn’t update cart. Item not found.");
        }
        return;
      }

      if (qty <= 0) {
        if (!opts?.silent) alertProgress("Removing from cart…");
        setCart((prev) => prev.filter((i) => i.slug !== slug));
        if (!opts?.silent) {
          window.setTimeout(() => {
            alertSuccess(`Removed ${name} from cart`);
          }, 220);
        }
        return;
      }

      if (!opts?.silent) alertProgress("Updating quantity…");
      setCart((prev) =>
        prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
      );
      if (!opts?.silent) {
        window.setTimeout(() => {
          alertSuccess(`Updated ${name} to ×${qty}`);
        }, 220);
      }
    },
    [resolveProduct, cart],
  );

  const removeFromCart = useCallback(
    (slug: string) => {
      const product = resolveProduct(slug);
      const name = product?.name ?? "item";
      const inCart = cart.some((i) => i.slug === slug);

      if (!inCart) {
        alertFailure("Couldn’t remove item. Already gone from cart.");
        return;
      }

      alertProgress("Removing from cart…");
      setCart((prev) => prev.filter((i) => i.slug !== slug));
      window.setTimeout(() => {
        alertSuccess(`Removed ${name} from cart`);
      }, 220);
    },
    [resolveProduct, cart],
  );

  const clearCart = useCallback((opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      alertProgress("Clearing cart…");
    }
    setCart([]);
    if (!opts?.silent) {
      window.setTimeout(() => {
        alertSuccess("Cart cleared");
      }, 220);
    }
  }, []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      const product = resolveProduct(slug);
      const removing = wishlist.includes(slug);

      if (!product && !removing) {
        alertFailure("Couldn’t update wishlist. Product unavailable.");
        return;
      }

      alertProgress(
        removing ? "Removing from wishlist…" : "Adding to wishlist…",
      );
      setWishlist((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
      );
      window.setTimeout(() => {
        alertSuccess(
          removing
            ? `Removed ${product?.name ?? "item"} from wishlist`
            : `Added ${product?.name ?? "item"} to wishlist`,
        );
      }, 220);
    },
    [resolveProduct, wishlist],
  );

  const isWishlisted = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist],
  );

  const cartProducts = useMemo(
    () =>
      cart
        .map((item) => {
          const product = resolveProduct(item.slug);
          if (!product) return null;
          return { product, qty: item.qty };
        })
        .filter(Boolean) as { product: Product; qty: number }[],
    [cart, resolveProduct],
  );

  const wishlistProducts = useMemo(
    () =>
      wishlist
        .map((slug) => resolveProduct(slug))
        .filter(Boolean) as Product[],
    [wishlist, resolveProduct],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () =>
      cartProducts.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [cartProducts],
  );

  const value = useMemo(
    () => ({
      catalog,
      collections,
      catalogSource,
      catalogError,
      catalogReady,
      cart,
      wishlist,
      cartCount,
      cartTotal,
      cartProducts,
      wishlistProducts,
      cartPanelOpen,
      cartPanelProductSlug,
      cartBarOpen,
      getCatalogProduct,
      addToCart,
      openCartPanel,
      closeCartPanel,
      hideCartBar,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      ready,
    }),
    [
      catalog,
      collections,
      catalogSource,
      catalogError,
      catalogReady,
      cart,
      wishlist,
      cartCount,
      cartTotal,
      cartProducts,
      wishlistProducts,
      cartPanelOpen,
      cartPanelProductSlug,
      cartBarOpen,
      getCatalogProduct,
      addToCart,
      openCartPanel,
      closeCartPanel,
      hideCartBar,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      ready,
    ],
  );

  return (
    <ShopStoreContext.Provider value={value}>
      {children}
    </ShopStoreContext.Provider>
  );
}

export function useShopStore() {
  const ctx = useContext(ShopStoreContext);
  if (!ctx) {
    return {
      catalog: [],
      collections: ["All"],
      catalogSource: null,
      catalogError: null,
      catalogReady: false,
      cart: [],
      wishlist: [],
      cartCount: 0,
      cartTotal: 0,
      cartProducts: [],
      wishlistProducts: [],
      cartPanelOpen: false,
      cartPanelProductSlug: null,
      cartBarOpen: false,
      getCatalogProduct: () => undefined,
      addToCart: () => {},
      openCartPanel: () => {},
      closeCartPanel: () => {},
      hideCartBar: () => {},
      setQty: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      toggleWishlist: () => {},
      isWishlisted: () => false,
      ready: false,
    } satisfies ShopStoreValue;
  }
  return ctx;
}
