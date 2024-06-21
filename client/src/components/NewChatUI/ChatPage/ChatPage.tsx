import ChatMessage from "../ChatMessage/ChatMessage";
import Form from "../Form/Form";
import Recorder from "../VoiceMessage/VoiceMessage";
import styles from "./ChatPage.module.css";

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
