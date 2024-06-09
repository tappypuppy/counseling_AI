/* 
 このファイルは、ユーザーがポストにいいねをしているかどうかを確認するためのAPIのルートを定義します。
*/

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { loggerInfo } from "@/lib/pino";
import { get_user_id } from "@/app/api/forum/post/function";

export async function GET(
  req: NextRequest,
  { params }: { params: { post_id: number , user_email: string} }
) {
  const { post_id, user_email } = params;

  // console.log(req);
  console.log("POST_ID:", post_id);
  console.log("USER_EMAIL:",user_email);
  const user_id = await get_user_id(user_email);
  console.log("USER_ID:",user_id);

  const { data, error } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (error) {
    console.log("ERROR")
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Like status is successfully retrieved.", {
    caller: "GET",
    status: 200,
  });

  console.log("ISLIKE:",data);

  return NextResponse.json(data);
}