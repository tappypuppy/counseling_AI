"use client";
import ChatPage from "@/components/ChatUI/ChatPage/ChatPage";
import { RecoilRoot } from "recoil";

export default function Home() {
  return (
    <main>
      <RecoilRoot>
        <ChatPage />
      </RecoilRoot>
    </main>
  );
}
