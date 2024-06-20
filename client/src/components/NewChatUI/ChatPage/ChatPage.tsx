import ChatMessage from '../ChatMessage/ChatMessage';
import Form from '../Form/Form';
import Recorder from '../VoiceMessage/VoiceMessage';
import styles from './ChatPage.module.css';

function ChatPage() {
    return (
        <div className={styles.inner}>
            <ChatMessage />
            <Form />
            <Recorder />
        </div>
    );
}

export default ChatPage;