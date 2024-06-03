import OpenAI, { ClientOptions } from "openai";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";



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
  const srcURL = `/audio/input/speech_${getFormattedDateTime()}.mp3`;
  

  // Code to convert audioBlob to speech
  // blob to file
  const audioFile = new File([audioBlob], "audio.wav", { type: audioBlob.type, lastModified: Date.now() });
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  });
  console.log("Transcription:", transcription.text);
  const { url } = await put(srcURL, audioFile, { access: 'public' });
  console.log("Audio URL:", url);

  return transcription.text;
};
