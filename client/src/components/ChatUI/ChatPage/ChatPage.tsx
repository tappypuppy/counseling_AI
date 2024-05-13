import ChatMessage from '../ChatMessage/ChatMessage';
import Top from '../Top/Top';
import styles from './ChatPage.module.css';

function ChatPage() {
    return (
        <div className={styles.inner}>
            <Top />
            <ChatMessage />
        </div>
    );
}

export default ChatPage;