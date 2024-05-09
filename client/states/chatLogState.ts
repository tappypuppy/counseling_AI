// states/chatLogState.ts
import { atom } from 'recoil';

// メッセージオブジェクトの型を定義
interface Message {
  id: number;
  content: string;
  sender: string;
}

// gptResponseStateの型をMessageの配列として定義
export const chatLogState = atom<Message[]>({
  key: 'chatLogState',
  default: [
    { id: 1, content: "こんにちは！", sender: "user" },
    { id: 2, content: "元気ですか？", sender: "other" }
  ],
});