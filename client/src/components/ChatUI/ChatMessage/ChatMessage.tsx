"use client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { chatLogState } from "@/state/chatLogState";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  room_id: number;
}

export default function ChatMessage({ room_id }: ChatMessageProps) {
  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  useEffect(() => {
    fetch("/api/messages/" + room_id + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const messages = data.messages;
        console.log(messages);
        // ex. messages = [ { 'message' : 'hello', 'sender' : 'AI' }, { 'message' : 'hi', 'sender' : 'user'}]

        setChatLog(
          messages.map((message: any, index: any) => ({
            id: index,
            context: message.message,
            sender: message.sender,
          }))
        );
      });
  }, []);

  return (
    <div className={styles.chat}>
      <div className={styles.inner}>
        {chatLog.map((message) => (
          <div
            key={message.id}
            className={message.sender === "AI" ? styles.gpt : styles.user}
          >
            {message.context}
          </div>
        ))}
      </div>
    </div>
  );
}
