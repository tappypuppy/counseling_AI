import { loggerInfo, loggerError } from "@/lib/pino";
import AI from "@/class/AI";

export async function POST(req: Request) {
  loggerInfo("api::api/openai/stt", { caller: "POST", status: 200 });

  const formData = await req.formData();
  const audioBlob = formData.get("audio");

  if (audioBlob) {
    const blob = new Blob([audioBlob]);
    const ai = new AI();
    const output_text = await ai.speechToText(blob);

    return new Response(JSON.stringify({ output: output_text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  else {
    loggerError("audioBlob is null", { caller: "POST", status: 400 });
    return new Response(
      JSON.stringify({ error: "audioBlob is null" }),
      { status: 400 }
    );
  }



}
