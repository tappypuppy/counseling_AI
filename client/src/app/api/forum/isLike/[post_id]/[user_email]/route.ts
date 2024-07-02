/* 
 このファイルは、ユーザーがポストにいいねをしているかどうかを確認するためのAPIのルートを定義します。
*/

import { NextRequest, NextResponse } from "next/server";
import { loggerInfo } from "@/lib/pino";
import DB from "@/class/DB";

export async function GET(
  req: NextRequest,
  { params }: { params: { post_id: number; user_email: string } }
) {
  const { post_id, user_email } = params;

  const db = new DB();
  const user_id = await db.getUserId(user_email);

  const { data, error } = await db.supabaseClient
    .from("likes")
    .select("post_id")
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (error) {
    console.log("ERROR");
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Like status is successfully retrieved.", {
    caller: "GET",
    status: 200,
  });

  return NextResponse.json(data);
}
