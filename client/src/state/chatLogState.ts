// states/chatLogState.ts
import { atom } from 'recoil';

// メッセージオブジェクトの型を定義
interface Message {
  id: number;
  context: string;
  sender: string;
}

// gptResponseStateの型をMessageの配列として定義
export const chatLogState = atom<Message[]>({
  key: 'chatLogState',
  default: [
    // { id: 1, context: "こんにちは！", sender: "gpt" },
  ],
});