import styles from "./Form.module.css";
import { FormEvent } from "react";
import { chatLogState } from "@/state/chatLogState";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useSession } from "next-auth/react";

function Form() {
  const [chatLog, setChatLog] = useRecoilState(chatLogState);
  const { data:session, status} = useSession();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = formData.get("input");
    if (session && session.user) {
      console.log(session.user.email);
    }
    
    // console.log(session?.user?.id);

    const newId = chatLog.length > 0 ? chatLog[chatLog.length - 1].id + 1 : 1;
    if (typeof input === "string" && input !== null) {
      const newUserMessage = {
        id: newId,
        context: input,
        sender: "user",
      };
      setChatLog([...chatLog, newUserMessage]);
    }

    const res = await fetch(`/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        // "kazuki_20240513_gpt3.5_compare_job_1"
        // "kazuki_20240514_gpt4_compare_job_1"
        userEmail: session?.user?.email,
        roomId: 1,
        message: formData.get("input"),
        isAudio: false,
        audioFile: "",
      }),
    });

    // Handle response if necessary
    const msg_json = await res.json();

    const newGPTId = newId + 1;
    const newGPTMessage = {
      id: newGPTId,
      context: msg_json.data.output,
      sender: "gpt",
    };
    setChatLog((prevChatLog) => [...prevChatLog, newGPTMessage]);
  }
  return (
    <div>
      <form onSubmit={onSubmit} className={styles.form}>
        <input type="text" name="input" placeholder="メッセージを入力..." />
        <button type="submit">送信</button>
      </form>
    </div>
  );
}

export default Form;
