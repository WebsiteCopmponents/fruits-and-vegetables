import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const catalog = await getCatalog({ collection, search });

    return NextResponse.json({
      source: catalog.source,
      products: catalog.products,
      collections: catalog.collections,
      count: catalog.products.length,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load products";
    return NextResponse.json(
      { error: message, source: null, products: [], collections: ["All"] },
      { status: 500 },
    );
  }
}
