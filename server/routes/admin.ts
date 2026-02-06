import { Router } from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

const router = Router();

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password: string): string => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: '아이디와 비밀번호를 입력해주세요.'
            });
        }

        const db = getDB();
        const admin = await db.collection('adminUsers').findOne({ username });

        if (!admin) {
            // Create default admin if none exists
            if (username === 'admin' && password === 'admin1234') {
                await db.collection('adminUsers').insertOne({
                    username: 'admin',
                    password: hashPassword('admin1234'),
                    role: 'admin',
                    createdAt: new Date(),
                });

                return res.json({
                    success: true,
                    data: {
                        token: 'admin-token-' + Date.now(),
                        user: { username: 'admin', role: 'admin' },
                    },
                });
            }
            return res.status(401).json({ success: false, error: '로그인 정보가 올바르지 않습니다.' });
        }

        if (admin.password !== hashPassword(password)) {
            return res.status(401).json({ success: false, error: '로그인 정보가 올바르지 않습니다.' });
        }

        res.json({
            success: true,
            data: {
                token: 'admin-token-' + Date.now(),
                user: { username: admin.username, role: admin.role },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: '로그인 실패' });
    }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const db = getDB();

        const [
            totalInquiries,
            pendingInquiries,
            totalDocuments,
            totalCustomers,
        ] = await Promise.all([
            db.collection('inquiries').countDocuments(),
            db.collection('inquiries').countDocuments({ status: 'pending' }),
            db.collection('documents').countDocuments(),
            db.collection('inquiries').aggregate([
                { $group: { _id: '$email' } },
                { $count: 'total' },
            ]).toArray().then(r => r[0]?.total || 0),
        ]);

        // Recent inquiries
        const recentInquiries = await db.collection('inquiries')
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        res.json({
            success: true,
            data: {
                stats: {
                    totalInquiries,
                    pendingInquiries,
                    totalDocuments,
                    totalCustomers,
                },
                recentInquiries,
            },
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, error: '통계 조회 실패' });
    }
});

// Customer management - Get all customers
router.get('/customers', async (req, res) => {
    try {
        const { page = '1', limit = '20', search = '' } = req.query;
        const db = getDB();

        // Aggregate inquiries by customer email
        const pipeline: object[] = [
            {
                $group: {
                    _id: '$email',
                    name: { $first: '$name' },
                    phone: { $first: '$phone' },
                    totalInquiries: { $sum: 1 },
                    lastInquiry: { $max: '$createdAt' },
                    statuses: { $push: '$status' },
                }
            },
            { $sort: { lastInquiry: -1 } },
        ];

        if (search) {
            pipeline.unshift({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                    ],
                },
            });
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const customers = await db.collection('inquiries')
            .aggregate([
                ...pipeline,
                { $skip: skip },
                { $limit: parseInt(limit as string) },
            ])
            .toArray();

        const totalResult = await db.collection('inquiries')
            .aggregate([...pipeline, { $count: 'total' }])
            .toArray();
        const total = totalResult[0]?.total || 0;

        res.json({
            success: true,
            data: customers.map(c => ({
                email: c._id,
                name: c.name,
                phone: c.phone,
                totalInquiries: c.totalInquiries,
                lastInquiry: c.lastInquiry,
                hasConfirmed: c.statuses.includes('confirmed'),
            })),
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ success: false, error: '고객 목록 조회 실패' });
    }
});

// Notice (게시판) CRUD
router.get('/notices', async (req, res) => {
    try {
        const { page = '1', limit = '10' } = req.query;
        const db = getDB();

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [notices, total] = await Promise.all([
            db.collection('notices')
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit as string))
                .toArray(),
            db.collection('notices').countDocuments(),
        ]);

        res.json({
            success: true,
            data: notices,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ success: false, error: '공지사항 조회 실패' });
    }
});

router.post('/notices', async (req, res) => {
    try {
        const { title, content, isPublished = true } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: '제목과 내용을 입력해주세요.'
            });
        }

        const db = getDB();
        const notice = {
            title,
            content,
            isPublished,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('notices').insertOne(notice);

        res.status(201).json({
            success: true,
            data: { id: result.insertedId },
            message: '공지사항이 등록되었습니다.',
        });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ success: false, error: '공지사항 등록 실패' });
    }
});

router.put('/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isPublished } = req.body;
        const db = getDB();

        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (isPublished !== undefined) updateData.isPublished = isPublished;

        const result = await db.collection('notices').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
        }

        res.json({ success: true, message: '공지사항이 수정되었습니다.' });
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({ success: false, error: '공지사항 수정 실패' });
    }
});

router.delete('/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();

        const result = await db.collection('notices').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
        }

        res.json({ success: true, message: '공지사항이 삭제되었습니다.' });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ success: false, error: '공지사항 삭제 실패' });
    }
});

export default router;
