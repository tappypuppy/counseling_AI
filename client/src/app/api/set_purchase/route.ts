import { NextRequest, NextResponse } from "next/server";

import { Stripe } from "stripe";
import DB from "@/class/DB";

export async function POST(req: NextRequest) {
  const { data, userId }: { data: Stripe.Checkout.Session; userId: string } =
    await req.json();

  const db = new DB();

  const customer_id = data.customer?.toString();
  const product_id = data.line_items?.data[0].price?.product?.toString();
  const price = data.line_items?.data[0].price?.unit_amount;
  const payment_method = data.payment_method_types?.[0];

  // unix timestamp
  const created = data.created;

  const created_at = new Date(created * 1000);
  const expired_at = new Date(created_at.getTime() + 24 * 60 * 60 * 1000);

  const { error } = await db.supabaseClient.from("purchases").insert({
    customer_id: customer_id,
    user_id: userId,
    product_id: product_id,
    price: price,
    payment_method: payment_method,
    created_at: created_at,
    expired_at: expired_at,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  return NextResponse.json({ status: "ok" });
}
