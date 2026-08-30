import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Collections live on /shop with filters — keep old URLs working. */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/shop?collection=${encodeURIComponent(slug)}`);
}
