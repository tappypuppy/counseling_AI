import { NextRequest, NextResponse } from "next/server";

import { loggerInfo } from "@/lib/pino";
import DB from "@/class/DB";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  loggerInfo("api::post/[id]", { caller: "GET", status: 200 });

  const { id } = params;

  const db = new DB();
  const { data, error } = await db.supabaseClient
    .from("posts")
    .select("user_id")
    .eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }
  const userId = data[0].user_id;

  /* 
 user_data example: 
 {
    name: 'Kazuki Takahashi',
    image: 'https://lh3.googleusercontent.com/a/ACg8ocJxsTP3JFk67rFg32LBBOTy2uiP-gf1RGqU9yAnecjbL5i3Rg=s96-c'
 }
 */

  const userData = await db.getUserData(userId);

  console.log("USER_DATA:", userData);

  return NextResponse.json(userData);
}
