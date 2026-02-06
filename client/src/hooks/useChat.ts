import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, ChatResponse } from '@shared/types';

interface UseChatOptions {
    onError?: (error: Error) => void;
}

export const useChat = (options?: UseChatOptions) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: uuidv4(),
            role: 'assistant',
            content: `안녕하세요! 산동 레스토랑입니다. 🥢

**영업시간**: 오전 11:00 ~ 오후 10:00 (연중무휴)
**주소**: 서울시 강남구 테헤란로 123 산동빌딩 1층
**전화**: 02-123-4567

정통 산동식 중식을 맛보실 수 있습니다. 케이터링 서비스, 견적 문의, 예약 등 무엇이든 물어보세요!`,
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => uuidv4());

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error('채팅 전송에 실패했습니다.');
            }

            const data: ChatResponse = await response.json();

            const assistantMessage: ChatMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: data.reply,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: uuidv4(),
                role: 'assistant',
                content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
            options?.onError?.(error as Error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, sessionId, options]);

    const clearMessages = useCallback(() => {
        setMessages([
            {
                id: uuidv4(),
                role: 'assistant',
                content: '대화가 초기화되었습니다. 무엇을 도와드릴까요?',
                timestamp: new Date(),
            },
        ]);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        sessionId,
    };
};
