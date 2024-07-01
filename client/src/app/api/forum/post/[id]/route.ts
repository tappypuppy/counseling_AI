import { NextRequest, NextResponse } from "next/server";
import { loggerInfo } from "@/lib/pino";
import { supabase, supabase_auth } from "@/lib/supabaseClient";
import { get_user_data } from "@/app/api/function";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  loggerInfo("Request received", { caller: "GET", status: 200 });
  const { data, error } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", params.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: "error" });
  }
  const user_id = data[0].user_id;

  /* 
 user_data example: 
 {
    name: 'Kazuki Takahashi',
    image: 'https://lh3.googleusercontent.com/a/ACg8ocJxsTP3JFk67rFg32LBBOTy2uiP-gf1RGqU9yAnecjbL5i3Rg=s96-c'
 }
 */

  const user_data = await get_user_data(user_id);

  console.log("USER_DATA:", user_data);

  return NextResponse.json(user_data);
}
