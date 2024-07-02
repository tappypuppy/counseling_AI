// import ChatMessage from "../ChatMessage/ChatMessage";
import ChatMessage from "@/components/ChatUI/ChatMessage/ChatMessage";
import Form from "@/components/ChatUI/Form/Form";
import Recorder from "@/components/ChatUI/VoiceMessage/VoiceMessage";
import styles from "./page.module.css";

function ChatPage() {
  return (
    <div className={styles.inner}>
      <ChatMessage />
      <div className={styles.input}>
        <Form />
        <Recorder />
      </div>
    </div>
  );
}

export default ChatPage;
