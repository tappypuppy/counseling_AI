import { SupabaseClient } from '@supabase/supabase-js';
/* 
 このファイルは、掲示板機能の投稿をポストするメソッドを定義しています。
 */

import { NextRequest, NextResponse } from "next/server";

import { loggerInfo } from "@/lib/pino";
import DB from "@/class/DB";

export async function POST(req: NextRequest) {
  const { userEmail, message } = await req.json();
  const timestamp = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  const db = new DB();
  const userId = await db.getUserId(userEmail);

  const { data, error } = await db.supabaseClient
    .from("posts")
    .insert([{ user_id: userId, posted_at: timestamp, message: message }]);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Post is successfully inserted.", { caller: "POST", status: 200 });

  return NextResponse.json({ status: "ok" });
}

export async function GET(req: NextRequest) {
  const db = new DB();
  const { data, error } = await db.supabaseClient.from("posts").select('*');

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  console.log("DATA:", data);
  loggerInfo("Posts are successfully retrieved.", { caller: "GET", status: 200 });

  return NextResponse.json(data);
}