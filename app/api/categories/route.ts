import { NextResponse } from "next/server";
import { getMegaMenuCategories } from "@/lib/mega-menu";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getMegaMenuCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load categories";
    return NextResponse.json({ error: message, categories: [] }, { status: 500 });
  }
}
