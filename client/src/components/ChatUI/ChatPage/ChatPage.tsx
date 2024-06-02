import ChatMessage from '../ChatMessage/ChatMessage';
import Form from '../Form/Form';
import Top from '../Top/Top';
import Recorder from '../VoiceMessage/VoiceMessage';
import styles from './ChatPage.module.css';

interface ChatPageProps {
    room_id: number;
}

function ChatPage(props: ChatPageProps) {
    return (
        <div className={styles.inner}>
            <ChatMessage room_id={props.room_id}  />
            <Form room_id={props.room_id} />
            <Recorder room_id={props.room_id}/>
        </div>
    );
}

export default ChatPage;
