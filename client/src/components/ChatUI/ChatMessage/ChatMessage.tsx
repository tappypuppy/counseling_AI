import { FormEvent, useState } from "react";
import styles from "./ChatMessage.module.css";

interface MessageType {
  id: number;
  context: string;
  sender: string;
}

export default function ChatMessage() {
  const [chatLog, setChatLog] = useState<MessageType[]>([
    // {
    //   id: 0,
    //   context:
    //     "こんにちは!カウンセラーのcocoroです。悩み事と、その時の気持ちについてお聞かせください。私はあなたの味方です。",
    //   sender: "gpt",
    // },
  ]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newId = chatLog.length > 0 ? chatLog[chatLog.length - 1].id + 1 : 1;
    const newUserMessage = {
      id: newId,
      context: formData.get("input"),
      sender: "user",
    };
    const updateMessage = [...chatLog, newUserMessage];

    const res = await fetch(`/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        // "kazuki_20240513_gpt3.5_compare_job_1"
        // "kazuki_20240514_gpt4_compare_job_1"
        userId: "kazuki_20240514_gpt4_compare_job_1",
        prompt: formData.get("input"),
      }),
    });

    // Handle response if necessary
    const msg_json = await res.json();

    const newGPTId = newId + 1;
    const newGPTMessage = {
      id: newGPTId,
      context: msg_json.data.output,
      sender: "gpt",
    };
    setChatLog([...updateMessage, newGPTMessage]);
  }

  return (
    <div className={styles.chat}>
      <div className={styles.inner}>
        {chatLog.map((message) => (
          <div
            key={message.id}
            className={message.sender === "gpt" ? styles.gpt : styles.user}
          >
            {message.sender}: {message.context}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        <input type="text" name="input" placeholder="メッセージを入力..." />
        <button type="submit">送信</button>
      </form>
    </div>
  );
}
