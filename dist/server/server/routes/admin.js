"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../db.js");
const mongodb_1 = require("mongodb");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
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
        const db = (0, db_js_1.getDB)();
        if (!db) {
            return res.status(500).json({ success: false, error: '데이터베이스 연결 오류' });
        }
        const admin = await db.collection('adminUsers').findOne({ username });
        if (!admin) {
            // Create default admin if none exists AND it's the specific default credential attempt
            // This is for initial setup convenience. In strict production, might want to remove or secure this.
            if (username === 'admin' && password === 'admin1234') {
                const hashedPassword = await bcryptjs_1.default.hash('admin1234', 10);
                await db.collection('adminUsers').insertOne({
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin',
                    createdAt: new Date(),
                });
                const token = jsonwebtoken_1.default.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
                return res.json({
                    success: true,
                    data: {
                        token,
                        user: { username: 'admin', role: 'admin' },
                    },
                });
            }
            return res.status(401).json({ success: false, error: '로그인 정보가 올바르지 않습니다.' });
        }
        const adminData = admin;
        const isMatch = await bcryptjs_1.default.compare(password, adminData.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: '로그인 정보가 올바르지 않습니다.' });
        }
        const token = jsonwebtoken_1.default.sign({ username: adminData.username, role: adminData.role }, JWT_SECRET, { expiresIn: '12h' });
        res.json({
            success: true,
            data: {
                token,
                user: { username: adminData.username, role: adminData.role },
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: '로그인 실패' });
    }
});
// Protect all following routes
router.use(auth_js_1.authenticateToken);
// Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const [totalInquiries, pendingInquiries, totalDocuments, totalCustomers,] = await Promise.all([
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
    }
    catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, error: '통계 조회 실패' });
    }
});
// Customer management - Get all customers
router.get('/customers', async (req, res) => {
    try {
        const { page = '1', limit = '20', search = '' } = req.query;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        // Aggregate inquiries by customer email
        const pipeline = [
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
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const customers = await db.collection('inquiries')
            .aggregate([
            ...pipeline,
            { $skip: skip },
            { $limit: parseInt(limit) },
        ])
            .toArray();
        const totalResult = await db.collection('inquiries')
            .aggregate([...pipeline, { $count: 'total' }])
            .toArray();
        const total = totalResult[0]?.total || 0;
        res.json({
            success: true,
            data: customers.map(c => {
                const customer = c;
                return {
                    email: customer._id,
                    name: customer.name,
                    phone: customer.phone,
                    totalInquiries: customer.totalInquiries,
                    lastInquiry: customer.lastInquiry,
                    hasConfirmed: customer.statuses.includes('confirmed'),
                };
            }),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ success: false, error: '고객 목록 조회 실패' });
    }
});
// Notice (게시판) CRUD
router.get('/notices', async (req, res) => {
    try {
        const { page = '1', limit = '10' } = req.query;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [notices, total] = await Promise.all([
            db.collection('notices')
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .toArray(),
            db.collection('notices').countDocuments(),
        ]);
        res.json({
            success: true,
            data: notices,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
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
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
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
    }
    catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ success: false, error: '공지사항 등록 실패' });
    }
});
router.put('/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isPublished } = req.body;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const updateData = { updatedAt: new Date() };
        if (title)
            updateData.title = title;
        if (content)
            updateData.content = content;
        if (isPublished !== undefined)
            updateData.isPublished = isPublished;
        const result = await db.collection('notices').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
        }
        res.json({ success: true, message: '공지사항이 수정되었습니다.' });
    }
    catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({ success: false, error: '공지사항 수정 실패' });
    }
});
router.delete('/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = (0, db_js_1.getDB)();
        if (!db)
            throw new Error('DB not connected');
        const result = await db.collection('notices').deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
        }
        res.json({ success: true, message: '공지사항이 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ success: false, error: '공지사항 삭제 실패' });
    }
});
exports.default = router;
