import styles from "./Form.module.css";
import { FormEvent } from "react";
import { chatLogState } from "@/state/chatLogState";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



const Form: React.FC = () => {
  // chatLogStateの状態を取得
  const [chatLog, setChatLog] = useRecoilState(chatLogState);
  // セッション情報を取得
  const { data: session, status } = useSession();
  const router = useRouter();

  // フォームの送信処理
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    // デフォルトのイベントをキャンセル
    event.preventDefault();

    // フォームのデータを取得
    const formData = new FormData(event.currentTarget);
    const input = formData.get("input");

    // セッション情報が取得できている場合
    if (session && session.user) {

      // 新規ルームの作成
      const res_create_room = await fetch("/api/create_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          userEmail: session.user.email,
        }),
      });

      // 新規ルームのIDを取得
      const res_json = await res_create_room.json();
      const res_room_id = res_json.data.room_id;

      // chatlog用のnewIdの設定
      const newId = chatLog.length > 0 ? chatLog[chatLog.length - 1].id + 1 : 1;
      if (typeof input === "string" && input !== null) {
        const newUserMessage = {
          id: newId,
          context: input,
          sender: "user",
        };
        setChatLog([...chatLog, newUserMessage]);
      }

      // ユーザーの入力をAPIに送信
      const res = await fetch(`/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          userEmail: session?.user?.email,
          roomId: res_room_id,
          message: formData.get("input"),
          isAudio: false,
          audioFile: "",
        }),
      });

      // APIからのレスポンスを取得
      const msg_json = await res.json();

      // レスポンスが文字列の場合、chatLogに追加
      const newGPTId = newId + 1;
      const newGPTMessage = {
        id: newGPTId,
        context: msg_json.data.output,
        sender: "gpt",
      };
      setChatLog((prevChatLog) => [...prevChatLog, newGPTMessage]);

      // チャットルームに遷移
      router.push(`/chat/${res_room_id}`);
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit} className={styles.form}>
        <input type="text" name="input" placeholder="メッセージを入力..." />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export default Form;
