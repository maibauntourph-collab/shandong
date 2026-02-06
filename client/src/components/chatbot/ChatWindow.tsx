import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import './ChatWindow.css';

interface ChatWindowProps {
    onMinimize: () => void;
    onClose: () => void;
}

const ChatWindow = ({ onMinimize, onClose }: ChatWindowProps) => {
    const { messages, isLoading, sendMessage } = useChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const quickReplies = [
        '견적 문의',
        '메뉴 추천',
        '예약 방법',
        '연락처',
    ];

    const handleQuickReply = (reply: string) => {
        sendMessage(reply);
    };

    return (
        <div className="chat-window glass-dark animate-fade-in-up">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-info">
                    <div className="chat-avatar">
                        <span>🍽️</span>
                    </div>
                    <div className="chat-header-text">
                        <h4>산동 레스토랑 AI</h4>
                        <span className="chat-status">
                            <span className="status-dot"></span>
                            24시간 상담 가능
                        </span>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button className="header-btn" onClick={onMinimize} aria-label="최소화">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <button className="header-btn" onClick={onClose} aria-label="닫기">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
                <div className="quick-replies">
                    {quickReplies.map((reply) => (
                        <button
                            key={reply}
                            className="quick-reply-btn"
                            onClick={() => handleQuickReply(reply)}
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    placeholder="메시지를 입력하세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="send-btn"
                    disabled={!inputValue.trim() || isLoading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
