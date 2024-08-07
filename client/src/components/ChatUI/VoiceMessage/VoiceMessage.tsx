"use client";
import { useState } from "react";
import Image from "next/image";
import { chatLogState } from "@/state/chatLogState";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./VoiceMessage.module.css";

interface RecorderProps {
  room_id?: number | undefined;
}

const Recorder: React.FC<RecorderProps> = ({ room_id }) => {
  // recordingの状態を管理
  const [recording, setRecording] = useState<boolean>(false);

  // MediaRecorderの状態を管理
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  // 録音した音声のURLを管理
  const [audioUrl, setAudioUrl] = useState<string>("");

  // chatLogStateの状態を取得
  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  // セッション情報を取得
  const { data: session, status } = useSession();

  const router = useRouter();

  // 録音開始処理
  const startRecording = async () => {
    // マイクの使用許可を取得
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MediaRecorderの設定
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    // 録音データの取得
    mediaRecorder.addEventListener("dataavailable", (e: BlobEvent) => {
      chunks.push(e.data);
    });

    // 録音停止時の処理
    mediaRecorder.addEventListener("stop", async () => {
      // 録音データをBlob形式に変換
      const audioBlob = new Blob(chunks, { type: "audio/mp3" });

      // 録音データのURLを生成
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // 録音データをFormData形式に変換
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        // 録音データをサーバーに送信
        const response = await fetch("/api/openai/stt", {
          method: "POST",
          body: formData,
        });

        // サーバーからのレスポンス処理
        if (!response.ok) {
          console.error("Server response was not ok", response);
        } else if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          // サーバーからのレスポンスをJSON形式に変換
          const responseData = await response.json();
          console.log("Speech-to-Text response:", responseData.output);

          // レスポンスをchatLogに追加
          const output_text = await responseData.output;
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

          // セッション情報が取得できている場合
          if (session && session.user) {
            let roomId = room_id;
            if (room_id === undefined) {
              // 新規ルームの作成
              const res_create_room = await fetch("/api/create_room", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                  userEmail: session.user.email,
                }),
              });

              // 新規ルームのIDを取得
              const res_json = await res_create_room.json();
              roomId = res_json.data.room_id;
            }

            // テキスト化した入力をAPIに送信
            const res = await fetch(`/api`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
              body: JSON.stringify({
                userEmail: session?.user?.email,
                roomId: roomId,
                message: output_text,
                isAudio: true,
                audioFile: "",
              }),
            });

            // APIからのレスポンスを取得
            const msg_json = await res.json();

            // chatLogに追加
            const newGPTId = newId + 1;
            const newGPTMessage = {
              id: newGPTId,
              context: msg_json.data.output,
              sender: "AI",
            };
            setChatLog((prevChatLog) => [...prevChatLog, newGPTMessage]);

            // テキスト化した出力を音声化
            const tts_response = await fetch("/api/openai/tts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
              body: JSON.stringify({
                textPrompt: msg_json.data.output,
              }),
            });

            // 音声データを再生
            const tts_data = await tts_response.json();
            console.log("TTS response:", tts_data.srcUrl);
            const audio = new Audio(tts_data.srcUrl);
            audio.play();

            if (room_id === undefined) {
              // チャットルームに遷移
              router.push(`/chat/${roomId}`);
            }
          }
        } else {
          console.error("Server response is not JSON", await response.text());
        }
      } catch (error) {
        console.error("Error converting speech to text:", error);
      }
    });

    // 録音開始
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
    <div className={styles.inner}>
      {!recording && (
        <button onClick={startRecording}>
          <Image
            className={styles.audio_img}
            src="/audio-off.svg"
            alt="microphone"
            width={24}
            height={24}
          />
        </button>
      )}
      {recording && (
        <button onClick={stopRecording}>
          <Image
            className={styles.audio_img}
            src="/audio-on.svg"
            alt="microphone"
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
};

export default Recorder;
