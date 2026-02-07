"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = void 0;
const generative_ai_1 = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = GEMINI_API_KEY ? new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY) : null;
const SYSTEM_PROMPT = `당신은 "아웃케이터링"의 AI 상담사입니다. 프리미엄 외식/케이터링 서비스를 제공하는 회사의 24시간 상담 챗봇입니다.

## 역할
- 견적 문의, 서비스 안내, 예약 상담을 친절하게 도와드립니다
- 고객이 원하는 행사 유형, 날짜, 인원에 맞는 정보를 제공합니다
- 필요시 담당자 연결을 안내합니다

## 서비스 정보
- 웨딩 케이터링: 1인당 80,000원~
- 기업 세미나/컨퍼런스: 1인당 35,000원~
- 기업 만찬: 1인당 65,000원~
- 홈파티: 1인당 55,000원~
- 가든파티: 1인당 70,000원~
- 갈라 디너: 1인당 150,000원~

## 연락처
- 전화: 02-1234-5678 (평일 09:00-18:00)
- 이메일: info@outcatering.kr
- 카카오톡: @아웃케이터링

## 응답 가이드라인
1. 항상 존댓말을 사용하고 친근하면서도 전문적인 어조를 유지하세요
2. 고객의 니즈를 파악하기 위한 질문을 적절히 하세요
3. 구체적인 견적은 상담 후 제공된다고 안내하세요
4. 이모지를 적절히 사용해 친근한 분위기를 만드세요
5. 답변은 간결하게 유지하세요 (3-5문장 정도)`;
const chatWithAI = async (message, context, history) => {
    // If no API key, return fallback response
    if (!genAI) {
        return getFallbackResponse(message);
    }
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        // Build context from vector search results
        let contextString = '';
        if (context.length > 0) {
            contextString = `\n\n## 참고 문서 내용:\n${context.join('\n\n')}`;
        }
        // Build conversation history
        const historyString = history
            .slice(-10) // Last 10 messages
            .map(h => `${h.role === 'user' ? '고객' : '상담사'}: ${h.content}`)
            .join('\n');
        const fullPrompt = `${SYSTEM_PROMPT}${contextString}

## 대화 기록:
${historyString}

고객: ${message}

상담사:`;
        const result = await model.generateContent(fullPrompt);
        const response = result.response.text();
        return response.trim();
    }
    catch (error) {
        console.error('Gemini API error:', error);
        return getFallbackResponse(message);
    }
};
exports.chatWithAI = chatWithAI;
const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    // Greeting
    if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
        return '안녕하세요! 아웃케이터링입니다. 🍽️\n\n프리미엄 케이터링 서비스에 대해 궁금한 점이 있으시면 말씀해 주세요!';
    }
    // Price inquiry
    if (lowerMessage.includes('가격') || lowerMessage.includes('견적') || lowerMessage.includes('얼마')) {
        return '서비스별 가격 안내입니다:\n\n• 웨딩 케이터링: 1인당 80,000원~\n• 기업 행사: 1인당 35,000원~\n• 홈파티: 1인당 55,000원~\n• 갈라 디너: 1인당 150,000원~\n\n정확한 견적은 행사 규모와 메뉴에 따라 달라집니다. 상세 견적을 원하시면 견적 문의 페이지를 이용해 주세요! 📝';
    }
    // Menu inquiry
    if (lowerMessage.includes('메뉴') || lowerMessage.includes('음식') || lowerMessage.includes('추천')) {
        return '저희는 행사 성격에 맞는 맞춤 메뉴를 구성해 드립니다! 🍴\n\n• 한식/양식/일식 코스\n• 핑거푸드 & 카나페\n• 디저트 & 티타임\n• 와인 페어링\n\n어떤 유형의 행사를 계획하고 계신가요?';
    }
    // Reservation inquiry  
    if (lowerMessage.includes('예약') || lowerMessage.includes('예정') || lowerMessage.includes('날짜')) {
        return '예약 관련 안내입니다! 📅\n\n• 최소 2주 전 예약을 권장드립니다\n• 성수기(5-6월, 10-11월)는 1-2개월 전 예약 필요\n• 계약 전 무료 시식 서비스 제공\n\n행사 예정일과 인원수를 알려주시면 자세한 상담을 도와드릴게요!';
    }
    // Contact inquiry
    if (lowerMessage.includes('연락') || lowerMessage.includes('전화') || lowerMessage.includes('상담')) {
        return '연락처 안내입니다! 📞\n\n• 전화: 02-1234-5678\n• 이메일: info@outcatering.kr\n• 운영시간: 평일 09:00-18:00\n\n또는 견적 문의 페이지에서 양식을 작성해 주시면 24시간 내에 연락드리겠습니다!';
    }
    // Default
    return '감사합니다! 추가로 궁금하신 점이 있으시면 말씀해 주세요. 😊\n\n• 서비스 종류\n• 가격 안내\n• 예약 방법\n• 메뉴 추천\n\n위 내용 중 어떤 것이 궁금하신가요?';
};
