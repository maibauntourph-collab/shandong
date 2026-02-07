"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../db.js");
const ai_js_1 = require("../services/ai.js");
const vectordb_js_1 = require("../services/vectordb.js");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message || !sessionId) {
            return res.status(400).json({
                success: false,
                error: '메시지와 세션 ID가 필요합니다.'
            });
        }
        const db = (0, db_js_1.getDB)();
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
            id: (0, uuid_1.v4)(),
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        // Search relevant documents from vector DB
        let context = [];
        try {
            const searchResults = await (0, vectordb_js_1.searchDocuments)(message, 3);
            context = searchResults.map(r => r.text);
        }
        catch (error) {
            console.log('Vector search skipped:', error);
        }
        // Generate AI response
        const aiResponse = await (0, ai_js_1.chatWithAI)(message, context, session.messages || []);
        // Add assistant message
        const assistantMessage = {
            id: (0, uuid_1.v4)(),
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
        const db = (0, db_js_1.getDB)();
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
exports.default = router;
