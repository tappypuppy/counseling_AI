// app/api/response/route.ts

import { NextRequest, NextResponse } from "next/server";
// import { create_room } from "./service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  console.log("Request received: get_messages", params.id);
  const res = await fetch("http://localhost:8000/messages/" + params.id + "/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  console.log("Response received: get_messages", await res);
  return res;
}
