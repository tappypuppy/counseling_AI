'use client';
import ChatPage from "@/components/ChatUI/ChatPage/ChatPage";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function Page({ params }: { params: { id: number } }) {
  return (
    <main>
      <SessionProvider>
        <RecoilRoot>
          <ChatPage room_id={params.id}/>
        </RecoilRoot>
      </SessionProvider>
    </main>
  );
}
