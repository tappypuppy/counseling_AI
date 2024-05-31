import { NextRequest, NextResponse } from "next/server";
import { createStripeCustomer } from "@/lib/stripe";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  const { userId, userName, userEmail } = await req.json();

  // 顧客の作成
  const customer = await createStripeCustomer(userId, userName, userEmail);

  return NextResponse.json({ customerId: customer.id });

}