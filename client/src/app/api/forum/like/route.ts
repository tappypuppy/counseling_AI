/* 
 このファイルは、いいね機能のAPIエンドポイントを定義するファイルです。
*/

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { loggerInfo } from "@/lib/pino";
import { get_user_id } from "@/app/api/forum/post/function";


export async function POST(req: NextRequest) {
  const { post_id, userEmail } = await req.json();
  const userId = await get_user_id(userEmail);

  const { data, error } = await supabase
    .from("likes")
    .insert([{ user_id: userId, post_id: post_id }]);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Like is successfully inserted.", { caller: "POST", status: 200 });

  return NextResponse.json({ status: "ok" });
}

export async function DELETE(req: NextRequest) {
  const { post_id, userEmail } = await req.json();
  const userId = await get_user_id(userEmail);

  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", post_id);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Like is successfully deleted.", { caller: "DELETE", status: 200 });

  return NextResponse.json({ status: "ok" });
}

