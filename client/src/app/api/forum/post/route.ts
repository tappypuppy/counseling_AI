/* 
 このファイルは、掲示板機能の投稿をポストするメソッドを定義しています。
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { get_user_id } from "@/app/api/forum/post/function";
import { loggerInfo } from "@/lib/pino";

export async function POST(req: NextRequest) {
  const { userEmail, message } = await req.json();
  const timestamp = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  const userId = await get_user_id(userEmail);

  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id: userId, posted_at: timestamp, message: message }]);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Post is successfully inserted.", { caller: "POST", status: 200 });

  return NextResponse.json({ status: "ok" });
}
