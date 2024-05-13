// app/api/response/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendPromptToGpt } from "./service";

export async function POST(request: NextRequest) {
  console.log("Request received");
  const { prompt, userId } = await request.json();

  const gptResponseMessage = await sendPromptToGpt(prompt, userId);

  const gptResponseMessageJson = await gptResponseMessage.json();
  console.log("gptResponseMessage:", gptResponseMessageJson);

  const response = NextResponse.json({
    data: gptResponseMessageJson,
  });
  console.log("Response sent");
  
  return response;
}
