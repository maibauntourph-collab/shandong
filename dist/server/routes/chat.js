import { Router } from 'express';
import { getDB } from '../db.js';
import { chatWithAI } from '../services/ai.js';
import { searchDocuments } from '../services/vectordb.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message || !sessionId) {
            return res.status(400).json({
                success: false,
                error: '메시지와 세션 ID가 필요합니다.'
            });
        }
        const db = getDB();
        const sessionsCollection = db.collection('chatSessions');
        // Get or create session
        let session = await sessionsCollection.findOne({ sessionId });
        if (!session) {
            session = {
                sessionId,
                messages: [],
                createdAt: new Date(),
            };
            await sessionsCollection.insertOne(session);
        }
        // Add user message
        const userMessage = {
            id: uuidv4(),
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        // Search relevant documents from vector DB
        let context = [];
        try {
            const searchResults = await searchDocuments(message, 3);
            context = searchResults.map(r => r.text);
        }
        catch (error) {
            console.log('Vector search skipped:', error);
        }
        // Generate AI response
        const aiResponse = await chatWithAI(message, context, session.messages || []);
        // Add assistant message
        const assistantMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        };
        // Update session
        await sessionsCollection.updateOne({ sessionId }, {
            $push: {
                messages: {
                    $each: [userMessage, assistantMessage],
                },
            },
            $set: { updatedAt: new Date() },
        });
        res.json({
            success: true,
            reply: aiResponse,
            sessionId,
        });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: '채팅 처리 중 오류가 발생했습니다.'
        });
    }
});
// Get chat history
router.get('/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const db = getDB();
        const session = await db.collection('chatSessions').findOne({ sessionId });
        res.json({
            success: true,
            messages: session?.messages || [],
        });
    }
    catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, error: '히스토리 조회 실패' });
    }
});
export default router;
