"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
export const Payment = () => {
  const { data:session, status} = useSession();
  const { push } = useRouter();

  async function handleClick() {
    const data = await fetch("/api/create_stripe_customer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: session?.user?.id,
            userName: session?.user?.name,
            userEmail: session?.user?.email,
        }),
        }).then((data) => data.json());

    const costumerId = await data.customerId;
    
    console.log('DATA: ', costumerId);
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: costumerId, // "cus_Q8lKDUCBhbp5aU", // ここに顧客IDを値に設定しましょう
        price_id: "price_1PITZBHfFYNX5yiouTo4Yy8w", // ここに商品IDを値に設定しましょう
      }),
    }).then((data) => data.json());
    push(response.checkout_url);
  }

  return (
      <div>
        <h1>Stripe Test購入画面</h1>
        <button
          onClick={handleClick}
        >
          商品購入ボタン
        </button>
      </div>
  );
};
export default Payment;
