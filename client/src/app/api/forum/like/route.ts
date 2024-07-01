import { SupabaseClient } from '@supabase/supabase-js';
/* 
 このファイルは、いいね機能のAPIエンドポイントを定義するファイルです。
*/

import { NextRequest, NextResponse } from "next/server";

import { loggerInfo } from "@/lib/pino";
import DB from "@/class/DB";


export async function POST(req: NextRequest) {
  const { post_id, userEmail } = await req.json();
  const db = new DB();
  const userId = await db.getUserId(userEmail);

  const { data, error } = await db.supabaseClient.from("likes").insert([{ user_id: userId, post_id: post_id }]);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Like is successfully inserted.", { caller: "POST", status: 200 });

  return NextResponse.json({ status: "ok" });
}

export async function DELETE(req: NextRequest) {
  const { post_id, userEmail } = await req.json();

  const db = new DB();

  const userId = await db.getUserId(userEmail);

  const { data, error } = await db.supabaseClient
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

