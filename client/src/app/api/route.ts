// app/api/response/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendPromptToGpt } from "./service";

export async function POST(request: NextRequest) {
  console.log("Request received");
  const { userName, roomName, message, isAudio, audioFile } =
    await request.json();

  const gptResponseMessage = await sendPromptToGpt(
    userName,
    roomName,
    message,
    isAudio,
    audioFile
  );

  const gptResponseMessageJson = await gptResponseMessage.json();
  console.log("gptResponseMessage:", gptResponseMessageJson);

  const response = NextResponse.json({
    data: gptResponseMessageJson,
  });
  console.log("Response sent");

  return response;
}
