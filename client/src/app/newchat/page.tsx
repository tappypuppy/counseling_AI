"use client";
import ChatPage from "@/components/NewChatUI/ChatPage/ChatPage";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <SessionProvider>
        <RecoilRoot>
          <ChatPage />
        </RecoilRoot>
      </SessionProvider>
    </div>
  );
}
