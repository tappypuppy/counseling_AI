import ChatMessage from '../ChatMessage/ChatMessage';
import Form from '../Form/Form';
import Top from '../Top/Top';
import Recorder from '../VoiceMessage/VoiceMessage';
import styles from './ChatPage.module.css';

function ChatPage() {
    return (
        <div className={styles.inner}>
            <Top />
            <ChatMessage />
            <Form />
            <Recorder />
        </div>
    );
}

export default ChatPage;