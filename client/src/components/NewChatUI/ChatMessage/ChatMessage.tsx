import { FormEvent, useState } from "react";
import { useRecoilState } from "recoil";
import { chatLogState } from "@/state/chatLogState";
import styles from "./ChatMessage.module.css";


export default function ChatMessage() {

  const [chatLog, setChatLog] = useRecoilState(chatLogState);
  


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
    </div>
  );
}
