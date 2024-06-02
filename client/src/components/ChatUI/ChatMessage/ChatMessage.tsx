'use client';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { chatLogState } from "@/state/chatLogState";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  room_id: number;
}

export default function ChatMessage( { room_id }: ChatMessageProps) {

  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  useEffect(() => {
    fetch( process.env.API_URL +"/messages/" + room_id + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const messages = data.messages
        console.log(messages)
        // ex. messages = [ { 'message' : 'hello', 'sender' : 'AI' }, { 'message' : 'hi', 'sender' : 'user'}]
        
        setChatLog(messages.map((message:any, index:any) => ({
          id: index,
          context: message.message,
          sender: message.sender
        })))
      }
    )
  }, []);



  // async function get_messages() {
  //   const res = await fetch("http://localhost:8000/messages/" + room_id + "/", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json;charset=UTF-8",
  //     },
  //   });

  //   console.log("Response received: get_messages", await res);
  //   return res;
  // }




  return (
    <div className={styles.chat}>
      <div className={styles.inner}>
        {chatLog.map((message) => (
          <div
            key={message.id}
            className={message.sender === "AI" ? styles.gpt : styles.user}
          >
            {message.sender}: {message.context}
          </div>
        ))}
      </div>
    </div>
  );
}
