import type { Stripe } from "stripe";
import PrintObject from "@/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}): Promise<JSX.Element> {
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await auth();
  const user_id = session?.user?.id;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "payment_intent"],
    });

  console.log(
    checkoutSession.created,
    checkoutSession.customer_email,
    checkoutSession.expires_at
  );

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  // URLをenvに入れておく
  const res = await fetch(`http://localhost:3000/api/set_purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: checkoutSession,
      userId: user_id,
    }),
  });

  return (
    <>
      <h1> Thank you for your purchase!</h1>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Checkout Session response:</h3>
      <PrintObject content={checkoutSession} />
    </>
  );
}
