import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const product = await getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
