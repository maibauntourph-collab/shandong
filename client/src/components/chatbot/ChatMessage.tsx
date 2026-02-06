import type { ChatMessage as ChatMessageType } from '@shared/types';
import './ChatMessage.css';

interface ChatMessageProps {
    message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
    const isUser = message.role === 'user';

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Format message content with line breaks
    const formatContent = (content: string) => {
        return content.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i < content.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
            {!isUser && (
                <div className="message-avatar">
                    <span>🍽️</span>
                </div>
            )}
            <div className="message-content">
                <div className="message-bubble">
                    {formatContent(message.content)}
                </div>
                <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
        </div>
    );
};

export default ChatMessage;
