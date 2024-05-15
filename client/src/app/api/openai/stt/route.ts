import { speechToText } from "./speech_to_text";

export async function POST(req: Request) {
  console.log("POST /api/openai/stt");

  const formData = await req.formData();
  console.log("formData:", formData);
  const audioBlob = formData.get("audio");
  console.log("audioBlob:", audioBlob);
  

  if (audioBlob) {
    const blob = new Blob([audioBlob]);
    const output_text = await speechToText(blob);
    console.log("Speech-to-Text response:", output_text);

    return new Response(JSON.stringify({ output: output_text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    console.error("audioBlob is null");
    // Handle the error or return early

    return new Response(
      JSON.stringify({ error: "audioBlob is null" }),
      { status: 400 }
    );
  }


}
