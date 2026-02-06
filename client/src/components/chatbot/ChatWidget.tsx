import { useState } from 'react';
import ChatWindow from './ChatWindow';
import './ChatWidget.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleChat = () => {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const minimizeChat = () => {
        setIsMinimized(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    return (
        <div className="chat-widget">
            {/* Chat Window */}
            {isOpen && !isMinimized && (
                <ChatWindow onMinimize={minimizeChat} onClose={closeChat} />
            )}

            {/* Minimized State */}
            {isMinimized && (
                <div className="chat-minimized glass" onClick={() => setIsMinimized(false)}>
                    <span className="minimized-icon">💬</span>
                    <span className="minimized-text">채팅 계속하기</span>
                </div>
            )}

            {/* Toggle Button */}
            <button
                className={`chat-toggle ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? '채팅 닫기' : '채팅 열기'}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
                {!isOpen && (
                    <span className="chat-badge">24H</span>
                )}
            </button>

            {/* Pulse Effect */}
            {!isOpen && (
                <div className="chat-pulse"></div>
            )}
        </div>
    );
};

export default ChatWidget;
