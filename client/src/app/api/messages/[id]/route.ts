/* 
  このファイルは、id に対応するメッセージを取得するための API ルートを提供します。
  このルートは、GET メソッドでのみアクセス可能です。
  このルートは、id に対応するメッセージを取得し、JSON 形式で返します。
*/

import { NextRequest, NextResponse } from "next/server";

import { loggerInfo } from "@/lib/pino";
import { supabase } from "@/lib/supabaseClient";
import { get_user_id } from "@/app/api/function";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {

  loggerInfo("Request received", { caller: "GET", status: 200 });

  const { data, error } = await supabase
    .from("messages")
    .select("message, sender")
    .eq("room_id", params.id);

  const response = NextResponse.json({ messages: data});

  console.log("Response received: get_messages", response);

  return response;
}
