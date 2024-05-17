import { useState } from "react";
import { chatLogState } from "@/state/chatLogState";
import { useRecoilState, useResetRecoilState } from "recoil";

const Recorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", (e: BlobEvent) => {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(chunks, { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      console.log(audioUrl);

      // Send the audioBlob to the server for saving
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const response = await fetch("/api/openai/stt", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Server response was not ok", response);
        } else if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const responseData = await response.json();
          console.log("Speech-to-Text response:", responseData.output);
          const output_text = responseData.output;
          const newId =
            chatLog.length > 0 ? chatLog[chatLog.length - 1].id + 1 : 1;
          if (typeof output_text === "string" && output_text !== null) {
            const newUserMessage = {
              id: newId,
              context: output_text,
              sender: "user",
            };
            setChatLog([...chatLog, newUserMessage]);
          }


          const res = await fetch(`/api`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              userName: "kazuki_20240517_gpt4o_test_1",
              roomName: "room1",
              message: output_text,
              isAudio: true,
              audioFile: "",
            }),
          });

          const msg_json = await res.json();

          const newGPTId = newId + 1;
          const newGPTMessage = {
            id: newGPTId,
            context: msg_json.data.output,
            sender: "gpt",
          };
          setChatLog((prevChatLog) => [...prevChatLog, newGPTMessage]);

          const tts_response = await fetch("/api/openai/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              textPrompt: msg_json.data.output,
            }),
          });

          const tts_data = await tts_response.json();
          console.log("TTS response:", tts_data.srcUrl);
          const audio = new Audio(tts_data.srcUrl);
          audio.play();



        } else {
          console.error("Server response is not JSON", await response.text());
        }
      } catch (error) {
        console.error("Error converting speech to text:", error);
      }
    });

    mediaRecorder.start();
    setMediaRecorder(mediaRecorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div>
      {!recording && <button onClick={startRecording}>録音開始</button>}
      {recording && <button onClick={stopRecording}>録音停止</button>}
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls />
          <a href={audioUrl} download="recording.wav">
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default Recorder;
