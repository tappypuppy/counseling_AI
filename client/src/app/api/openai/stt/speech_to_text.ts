import OpenAI, { ClientOptions } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
} as ClientOptions);

const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;
};

export const speechToText = async (audioBlob: Blob) => {
  const srcURL = `./audio/speech_${getFormattedDateTime()}.mp3`;
  const speechFile = path.resolve(
    `./public/audio/speech_${getFormattedDateTime()}.mp3`
  );
  const arrayBuffer = await audioBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(speechFile, buffer);
  // Code to convert audioBlob to speech
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(speechFile),
    model: "whisper-1",
  });
  console.log("Transcription:", transcription.text);

  return transcription.text;
};
