"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
export const Payment = () => {
  const { data:session, status} = useSession();
  const { push } = useRouter();

  async function handleClick() {

    // customer idの取得, なければ作成
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

    const costumerId = data.customerId;

    // 支払いセッションの作成
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: costumerId,

        // envに格納した方がいいかも
        price_id: "price_1PITZBHfFYNX5yiouTo4Yy8w", // ここに商品IDを値に設定しましょう
      }),
    }).then((data) => data.json());

    // 支払い画面へ遷移
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
