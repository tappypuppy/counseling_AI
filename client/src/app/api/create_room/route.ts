// app/api/response/route.ts

// todo: 変数名修正

import { NextRequest, NextResponse } from "next/server";
import { create_room } from "./service";

export async function POST(request: NextRequest) {
  console.log("Request received: create_room");
  const { userEmail } =
    await request.json();

  const function_message = await create_room(
    userEmail,
  );

  const function_message_json = await function_message.json();
  console.log("function_message:", function_message_json);

  const response = NextResponse.json({
    data: function_message_json,
  });
  console.log("Response sent");

  return response;
}
