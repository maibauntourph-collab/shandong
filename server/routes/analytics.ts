import { Router } from 'express';
import { getDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken as any);

router.get('/dashboard', async (req, res) => {
    try {
        const db = getDB();
        if (!db) return res.status(500).json({ success: false, error: 'DB error' });

        // 1. Monthly Revenue (Mocked for now as inquiry budget is string/uncertain)
        // In a real app, we'd aggregate confirmed orders' budgets.
        // For now, let's count confirmed inquiries by month.
        const monthlyInquiries = await db.collection('inquiries').aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                    confirmed: {
                        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        // 2. Status Distribution
        const statusDistribution = await db.collection('inquiries').aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // 3. Recent Sales (Mock data for visualization if no real sales data exists)
        // We'll simulate some revenue data based on confirmed inquiries assuming avg 500,000 KRW
        const revenueData = monthlyInquiries.map(m => ({
            name: `${m._id}월`,
            revenue: m.confirmed * 500000,
            inquiries: m.count
        }));

        res.json({
            success: true,
            data: {
                revenue: revenueData,
                status: statusDistribution.map(s => ({ name: s._id, value: s.count }))
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
});

export default router;
