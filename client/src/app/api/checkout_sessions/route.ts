import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customer_id, price_id } = await req.json();

  const customer = await stripe.customers.retrieve(customer_id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    mode: "payment",
    customer: customer.id,
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  const res = NextResponse.json({
    checkout_url: session.url,
  });
  return res;
}
