import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProduct, isWooConfigured } from "@/lib/products";
import { createWooOrder, fetchWooOrdersByEmail } from "@/lib/woo";

type CreateBody = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country?: string;
  shippingMethod: "standard" | "express";
  items: Array<{ slug: string; qty: number }>;
};

function formatOrderStatus(status: string) {
  return status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ orders: [] });
    }

    if (!isWooConfigured()) {
      return NextResponse.json({
        orders: [],
        source: "demo",
        message: "Connect WooCommerce to sync real orders.",
      });
    }

    const wooOrders = await fetchWooOrdersByEmail(email);
    const orders = wooOrders.map((o) => ({
      id: o.number || String(o.id),
      date: new Date(o.date_created).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: formatOrderStatus(o.status),
      total: `${o.currency} ${o.total}`,
      items: o.line_items.map((li) => li.name).join(", "),
    }));

    return NextResponse.json({ orders, source: "woo" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBody;
    const {
      email,
      firstName,
      lastName,
      address,
      city,
      postcode,
      country,
      shippingMethod,
      items,
    } = body;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !postcode ||
      !items?.length
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shippingTotal = shippingMethod === "express" ? 12 : 0;
    const { userId } = await auth();

    if (!isWooConfigured()) {
      const orderId = `LG-${Date.now().toString().slice(-8)}`;
      return NextResponse.json({
        orderId,
        source: "demo",
        message: "Woo not configured — demo order created locally.",
      });
    }

    const lineItems: Array<{ product_id: number; quantity: number }> = [];
    for (const item of items) {
      const product = await getProduct(item.slug);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${item.slug}` },
          { status: 400 },
        );
      }
      lineItems.push({ product_id: product.id, quantity: item.qty });
    }

    const order = await createWooOrder({
      email,
      firstName,
      lastName,
      address,
      city,
      postcode,
      country,
      shippingMethod: shippingMethod === "express" ? "express" : "standard",
      shippingTotal,
      lineItems,
      clerkUserId: userId ?? undefined,
    });

    return NextResponse.json({
      orderId: order.number || String(order.id),
      source: "woo",
      status: order.status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
