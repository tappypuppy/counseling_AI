// src/app/api/open-ai/dall-e-v3/route.ts
import { loggerInfo } from "@/lib/pino";
import AI from "@/class/AI";

export async function POST(req: Request) {
  loggerInfo("api::api/openai/tts", { caller: "POST", status: 200 });
  const { textPrompt } = await req.json();

  if (typeof textPrompt !== "string") {
    return new Response(
      JSON.stringify({ error: "textPrompt must be a string" }),
      { status: 400 }
    );
  }

  const ai = new AI();
  const srcUrl = await ai.textToSpeech(textPrompt);

  return new Response(JSON.stringify({ srcUrl }), { status: 200 });
}
