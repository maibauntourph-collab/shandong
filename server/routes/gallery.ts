import { Router } from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all gallery items (Public)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const db = getDB();
        if (!db) {
            return res.status(500).json({ success: false, error: 'Database not connected' });
        }

        const filter: any = {};
        if (category && category !== 'all') {
            filter.category = category;
        }

        const items = await db.collection('gallery')
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        res.json({ success: true, data: items });
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch gallery items' });
    }
});

// Admin routes - Require Authentication
router.use(authenticateToken as any);

// Add gallery item
router.post('/', async (req, res) => {
    try {
        const { title, category, imageUrl, description } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ success: false, error: 'Image URL is required' });
        }

        const db = getDB();
        if (!db) {
            return res.status(500).json({ success: false, error: 'Database not connected' });
        }

        const newItem = {
            title: title || '',
            category: category || 'general',
            imageUrl,
            description: description || '',
            createdAt: new Date()
        };

        const result = await db.collection('gallery').insertOne(newItem);

        res.status(201).json({
            success: true,
            data: { ...newItem, _id: result.insertedId },
            message: 'Gallery item added successfully'
        });
    } catch (error) {
        console.error('Add gallery item error:', error);
        res.status(500).json({ success: false, error: 'Failed to add gallery item' });
    }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        if (!db) {
            return res.status(500).json({ success: false, error: 'Database not connected' });
        }

        const result = await db.collection('gallery').deleteOne({
            _id: new ObjectId(id)
        } as any);

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        res.json({ success: true, message: 'Gallery item deleted' });
    } catch (error) {
        console.error('Delete gallery item error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
    }
});

export default router;
