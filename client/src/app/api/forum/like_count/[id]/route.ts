/* 
 このファイルは、いいね数を取得するAPIのルートファイルです。
*/

import { NextRequest, NextResponse } from "next/server";

import { loggerInfo } from "@/lib/pino";
import DB from "@/class/DB";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  const db = new DB();
  
  const { count, error } = await db.supabaseClient
    .from("likes")
    .select('*', { count: 'exact', head: true })
    .eq("post_id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }

  loggerInfo("Like count is successfully retrieved.", {
    caller: "GET",
    status: 200,
  });

  return NextResponse.json(count);
}
