/* 
 このファイルは、いいね数を取得するAPIのルートファイルです。
*/

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { loggerInfo } from "@/lib/pino";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  const { count, error } = await supabase
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

  console.log(count);

  return NextResponse.json(count);
}
