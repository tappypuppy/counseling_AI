import OpenAI, { ClientOptions } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
} as ClientOptions);

const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

export const textToSpeech = async (text: string) => {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const srcURL = `./audio/speech_${getFormattedDateTime()}.mp3`;
  const speechFile = path.resolve(`./public/audio/speech_${getFormattedDateTime()}.mp3`);
  await fs.promises.writeFile(speechFile, buffer);
  console.log(`Audio saved to ${speechFile}`);

  return srcURL;
};
