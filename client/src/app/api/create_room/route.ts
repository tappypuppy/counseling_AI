// app/api/response/route.ts

// todo: 変数名修正

import { NextRequest, NextResponse } from "next/server";
import { create_room } from "./service";

export async function POST(request: NextRequest) {
  console.log("Request received: create_room");
  const { userEmail } =
    await request.json();

  const gptResponseMessage = await create_room(
    userEmail,
  );

  const gptResponseMessageJson = await gptResponseMessage.json();
  console.log("gptResponseMessage:", gptResponseMessageJson);

  const response = NextResponse.json({
    data: gptResponseMessageJson,
  });
  console.log("Response sent");

  return response;
}
