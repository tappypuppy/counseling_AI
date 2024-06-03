import { loggerInfo } from "@/lib/pino";

export const sendPromptToGpt = async (
  userEmail: string,
  roomId: number,
  message: string,
  isAudio: boolean,
  audioFile: string
) => {
  loggerInfo("Request received", { caller: "sendPromptToGpt", status: 200});

  const res = await fetch( process.env.API_URL + "/input/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      user_email: userEmail,
      room_id: roomId,
      message: message,
      is_audio: isAudio,
      audio_file: audioFile,
    }),
  });

  // const gptResponseMessage = res.json();
  return res;
};
