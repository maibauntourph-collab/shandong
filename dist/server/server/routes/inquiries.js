"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../db.js");
const mongodb_1 = require("mongodb");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Create inquiry (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, eventDate, guestCount, eventType, budget, message } = req.body;
        if (!name || !email || !phone || !eventDate || !guestCount || !eventType) {
            return res.status(400).json({
                success: false,
                error: '필수 항목을 모두 입력해주세요.'
            });
        }
        const db = (0, db_js_1.getDB)();
        if (!db) {
            return res.status(500).json({ success: false, error: '시스템 오류' });
        }
        const inquiry = {
            name,
            email,
            phone,
            eventDate: new Date(eventDate),
            guestCount: parseInt(guestCount),
            eventType,
            budget: budget || '미정',
            message: message || '',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await db.collection('inquiries').insertOne(inquiry);
        res.status(201).json({
            success: true,
            data: { id: result.insertedId },
            message: '견적 문의가 접수되었습니다.',
        });
    }
    catch (error) {
        console.error('Create inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 접수 실패' });
    }
});
// Admin routes - Require Authentication
router.use(auth_js_1.authenticateToken);
// Get all inquiries (admin)
router.get('/', async (req, res) => {
    try {
        const { status, page = '1', limit = '20', search } = req.query;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [inquiries, total] = await Promise.all([
            db.collection('inquiries')
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .toArray(),
            db.collection('inquiries').countDocuments(filter),
        ]);
        res.json({
            success: true,
            data: inquiries,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Get inquiries error:', error);
        res.status(500).json({ success: false, error: '문의 목록 조회 실패' });
    }
});
// Get single inquiry
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const inquiry = await db.collection('inquiries').findOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (!inquiry) {
            return res.status(404).json({ success: false, error: '문의를 찾을 수 없습니다.' });
        }
        res.json({ success: true, data: inquiry });
    }
    catch (error) {
        console.error('Get inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 조회 실패' });
    }
});
// Update inquiry status
const zod_1 = require("zod");
const logisticsSchema = zod_1.z.object({
    staffAssigned: zod_1.z.array(zod_1.z.string()),
    vehicle: zod_1.z.string(),
    equipment: zod_1.z.array(zod_1.z.string())
});
const updateSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'contacted', 'confirmed', 'completed', 'cancelled']).optional(),
    notes: zod_1.z.string().optional(),
    eventLogistics: logisticsSchema.optional()
});
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validation = updateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error.message });
        }
        const { status, notes, eventLogistics } = req.body;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const updateData = { updatedAt: new Date() };
        if (status)
            updateData.status = status;
        if (notes !== undefined)
            updateData.notes = notes;
        if (eventLogistics)
            updateData.eventLogistics = eventLogistics;
        const result = await db.collection('inquiries').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'Inquiry not found' });
        }
        res.json({ success: true, message: 'Inquiry updated' });
    }
    catch (error) {
        console.error('Update inquiry error:', error);
        res.status(500).json({ success: false, error: 'Failed to update inquiry' });
    }
});
// Delete inquiry (owner only)
router.delete('/:id', (0, auth_js_1.requireRole)('owner'), async (req, res) => {
    try {
        const { id } = req.params;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const result = await db.collection('inquiries').deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: '문의를 찾을 수 없습니다.' });
        }
        res.json({ success: true, message: '문의가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 삭제 실패' });
    }
});
exports.default = router;
