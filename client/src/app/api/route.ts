// app/api/response/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendPromptToGpt } from "./service";
import { loggerInfo } from "@/lib/pino";

export async function POST(request: NextRequest) {
  loggerInfo("Request received", { caller: "POST" , status: 200});
  const { userEmail, roomId, message, isAudio, audioFile } =
    await request.json();
  
  loggerInfo("userEmail: " + userEmail, { caller: "POST" , status: 200});
  loggerInfo("roomId: " + roomId, { caller: "POST" , status: 200});
  loggerInfo("message: " + message, { caller: "POST" , status: 200});

  const gptResponseMessage = await sendPromptToGpt(
    userEmail,
    roomId,
    message,
    isAudio,
    audioFile
  );

  const gptResponseMessageJson = await gptResponseMessage.json();
  loggerInfo("gptResponseMessage: " + gptResponseMessageJson, { caller: "POST" , status: 200});

  const response = NextResponse.json({
    data: gptResponseMessageJson,
  });

  return response;
}
