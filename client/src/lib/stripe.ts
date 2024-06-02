import "server-only";

import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  appInfo: {
    name: "cocoro",
    url: process.env.API_URL,
  },
});

export async function createStripeCustomer(userId: string, userName:string, userEmail: string,) {

  // 既に Stripe 顧客が存在するか確認
  const is_exsist = await stripe.customers.list({email: userEmail});

  // 既に Stripe 顧客が存在する場合
  if(is_exsist.data.length > 0){
    console.log("CUSTOMER IS ALREADY EXSIST");
    console.log("CUSTOMER: ", is_exsist.data);
    return is_exsist.data[0];
  }

  // Stripe 顧客の作成
  const customer = await stripe.customers.create({
    name: userName,
    email: userEmail,

    metadata: {
      userId,
    },
  });

  console.log("CUSTOMER: ", customer);

  // Supabase に保存
  await supabase
    .from("next_auth.users")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer;
}
