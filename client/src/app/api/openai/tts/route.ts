// src/app/api/open-ai/dall-e-v3/route.ts
import { textToSpeech } from "./text_to_speech";

export async function POST(req: Request) {
    console.log("POST /api/openai/tts");
  const { textPrompt } = await req.json();

  if (typeof textPrompt !== "string") {
    return new Response(
      JSON.stringify({ error: "textPrompt must be a string" }),
      { status: 400 }
    );
  }

  const srcUrl = await textToSpeech(textPrompt);
  return new Response(JSON.stringify({ srcUrl }), { status: 200 });
}