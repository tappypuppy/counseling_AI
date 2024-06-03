import { NextRequest, NextResponse } from "next/server";
import { loggerInfo } from "@/lib/pino";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {

  loggerInfo("Request received", { caller: "GET", status: 200 });
  const res = await fetch(process.env.API_URL + "/messages/" + params.id + "/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  const res_json = await res.json();

  console.log("Response received: get_messages", res_json);
  loggerInfo("Response received: get_messages" + res_json, { caller: "GET", status: 200 })
  return NextResponse.json(res_json);
}
