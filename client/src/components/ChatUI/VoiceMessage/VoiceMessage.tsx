import { useState } from "react";

const Recorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string>("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", (e: BlobEvent) => {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      console.log(audioUrl);

      // Send the audioBlob to the server for saving
      const formData = new FormData();
      formData.append("audio", audioBlob);
      try {
        const response = await fetch("http://localhost:8000/audio_input/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Audio saved:", data.output);
        const output_text = data.output;
        const tts_response = await fetch("/api/openai/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            textPrompt: output_text,
          }),
        });
        const tts_data = await tts_response.json();
        console.log("TTS response:", tts_data.srcUrl);
        const audio = new Audio(tts_data.srcUrl);
        audio.play();
      } catch (error) {
        console.error("Error saving audio:", error);
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
