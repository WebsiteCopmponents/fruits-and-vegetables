"use client";

import ProductCard from "@/components/shop/ProductCard";
import { EmptyState, PageShell } from "@/components/shop/PageShell";
import { useShopStore } from "@/lib/shop-store";

export default function WishlistPage() {
  const { wishlistProducts } = useShopStore();

  return (
    <PageShell
      eyebrow="Saved"
      title="Wishlist"
      description="Totes you’ve saved for later."
    >
      {wishlistProducts.length === 0 ? (
        <EmptyState
          title="No saved totes yet"
          body="Tap the heart on any product card to add it here."
          href="/shop"
          cta="Browse shop"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
