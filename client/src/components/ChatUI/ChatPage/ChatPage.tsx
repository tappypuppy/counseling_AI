import ChatMessage from "../ChatMessage/ChatMessage";
import Form from "../Form/Form";
import Recorder from "../VoiceMessage/VoiceMessage";
import styles from "./ChatPage.module.css";

interface ChatPageProps {
  room_id: number;
}

function ChatPage(props: ChatPageProps) {
  return (
    <div className={styles.inner}>
      <ChatMessage room_id={props.room_id} />
      <div className={styles.input}>
        <Form room_id={props.room_id} />
        <Recorder room_id={props.room_id} />
      </div>
    </div>
  );
}

export default ChatPage;
