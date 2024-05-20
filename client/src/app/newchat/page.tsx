"use client";
import ChatPage from "@/components/NewChatUI/ChatPage/ChatPage";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function Home() {
  return (
    <main>
      <SessionProvider>
        <RecoilRoot>
          <ChatPage />
        </RecoilRoot>
      </SessionProvider>
    </main>
  );
}
