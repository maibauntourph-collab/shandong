import { Router } from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

const router = Router();

// Create inquiry
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, eventDate, guestCount, eventType, budget, message } = req.body;

        if (!name || !email || !phone || !eventDate || !guestCount || !eventType) {
            return res.status(400).json({
                success: false,
                error: '필수 항목을 모두 입력해주세요.'
            });
        }

        const db = getDB();
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
    } catch (error) {
        console.error('Create inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 접수 실패' });
    }
});

// Get all inquiries (admin)
router.get('/', async (req, res) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;
        const db = getDB();

        const filter: Record<string, unknown> = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [inquiries, total] = await Promise.all([
            db.collection('inquiries')
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit as string))
                .toArray(),
            db.collection('inquiries').countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: inquiries,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        console.error('Get inquiries error:', error);
        res.status(500).json({ success: false, error: '문의 목록 조회 실패' });
    }
});

// Get single inquiry
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();

        const inquiry = await db.collection('inquiries').findOne({
            _id: new ObjectId(id)
        });

        if (!inquiry) {
            return res.status(404).json({ success: false, error: '문의를 찾을 수 없습니다.' });
        }

        res.json({ success: true, data: inquiry });
    } catch (error) {
        console.error('Get inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 조회 실패' });
    }
});

// Update inquiry status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const db = getDB();

        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const result = await db.collection('inquiries').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: '문의를 찾을 수 없습니다.' });
        }

        res.json({ success: true, message: '문의가 업데이트되었습니다.' });
    } catch (error) {
        console.error('Update inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 업데이트 실패' });
    }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();

        const result = await db.collection('inquiries').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: '문의를 찾을 수 없습니다.' });
        }

        res.json({ success: true, message: '문의가 삭제되었습니다.' });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({ success: false, error: '문의 삭제 실패' });
    }
});

export default router;
