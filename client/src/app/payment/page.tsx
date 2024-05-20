'use client';
import { useRouter } from "next/navigation";
export const Payment = () => {
  const { push } = useRouter();
  return (
    <>
      <div>
        <h1>Stripe Test購入画面</h1>
        <button
          onClick={async () => {
            const response = await fetch("/api/checkout_sessions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customer_id: "cus_Q8lKDUCBhbp5aU", // ここに顧客IDを値に設定しましょう
                price_id: "price_1PITZBHfFYNX5yiouTo4Yy8w",  // ここに商品IDを値に設定しましょう
              }),
            }).then((data) => data.json());
            push(response.checkout_url);
          }}
        >
          商品購入ボタン
        </button>
      </div>
    </>
  );
};
export default Payment;