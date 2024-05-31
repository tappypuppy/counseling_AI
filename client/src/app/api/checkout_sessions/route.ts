import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customer_id, price_id } = await req.json();
  const origin: string = headers().get("origin") as string;


  // const customer = await stripe.customers.retrieve(customer_id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    mode: "payment",
    customer: customer_id,
    success_url: `${origin}/payment/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/payment`,
  });

  console.log(session);
  const res = NextResponse.json({
    checkout_url: session.url,
  });
  return res;
}
