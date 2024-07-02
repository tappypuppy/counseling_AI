/* 
  このファイルは、id に対応するメッセージを取得するための API ルートを提供します。
  このルートは、GET メソッドでのみアクセス可能です。
  このルートは、id に対応するメッセージを取得し、JSON 形式で返します。
*/

import { NextRequest, NextResponse } from "next/server";

import { loggerInfo } from "@/lib/pino";
import DB from "@/class/DB";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  loggerInfo("api::api/messages/[id]", { caller: "GET", status: 200 });

  const db = new DB();

  const { data, error } = await db.supabaseClient
    .from("messages")
    .select("message, sender")
    .eq("room_id", params.id);

  const response = NextResponse.json({ messages: data});

  return response;
}
