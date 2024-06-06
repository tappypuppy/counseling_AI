/* 
 このファイルは、掲示板機能の投稿をポストするメソッドを定義しています。
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { userId, message } = await req.json();
  const timestamp = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id: userId, posted_at: timestamp, message: message }]);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  return NextResponse.json({ status: "ok" });
}
