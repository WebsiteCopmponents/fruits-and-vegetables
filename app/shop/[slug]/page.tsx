import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, getProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import ProductBuyActions from "@/components/shop/ProductBuyActions";
import ProductGallery from "@/components/shop/ProductGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.collection === product.collection)
    .slice(0, 3);

  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <Link
          href="/shop"
          className="text-[14px] font-medium text-accent hover:opacity-70"
        >
          ← Back to shop
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
          <ProductGallery
            images={product.images && product.images.length > 0 ? product.images : [product.image]}
            alt={product.name}
            badge={product.badge}
          />

          <div className="flex flex-col justify-center">
            <p className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
              {product.collection}
            </p>
            <h1 className="mt-3 text-[34px] font-medium tracking-tight text-[#1a1a1a] md:text-[42px]">
              {product.name}
            </h1>
            <p className="mt-3 text-[22px] text-[#1a1a1a]">
              {formatPrice(product.price)}
            </p>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#1a1a1a]/70">
              {product.description}
            </p>

            <ProductBuyActions slug={product.slug} />

            <ul className="mt-10 space-y-2 text-[14px] text-[#1a1a1a]/65">
              <li>Free shipping on orders over $85</li>
              <li>Easy 30-day returns</li>
              <li>Designed for everyday carry</li>
            </ul>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20">
            <h2 className="text-[24px] font-medium tracking-tight text-[#1a1a1a]">
              More from {product.collection}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
