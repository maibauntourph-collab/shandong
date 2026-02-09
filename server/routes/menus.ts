import { Router } from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Protect all menu routes
router.use(authenticateToken as any);

// Get all menus
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        if (!db) throw new Error('DB not connected');

        const menus = await db.collection('menus').find().sort({ id: 1 }).toArray();
        res.json({ success: true, data: menus });
    } catch (error) {
        console.error('Get menus error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch menus' });
    }
});

// Create new menu
router.post('/', async (req, res) => {
    try {
        const menu = req.body;
        const db = getDB();
        if (!db) throw new Error('DB not connected');

        const result = await db.collection('menus').insertOne({
            ...menu,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({ success: true, data: { ...menu, _id: result.insertedId } });
    } catch (error) {
        console.error('Create menu error:', error);
        res.status(500).json({ success: false, error: 'Failed to create menu' });
    }
});

// Update menu
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const menu = req.body;
        // Remove _id from update data if present to avoid immutable field error
        const { _id, ...updateData } = menu;

        const db = getDB();
        if (!db) throw new Error('DB not connected');

        // Handle both numeric ID (legacy) and ObjectId
        const query = isNaN(Number(id)) ? { _id: new ObjectId(id) } : { id: Number(id) };

        const result = await db.collection('menus').updateOne(
            query as any,
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'Menu not found' });
        }

        res.json({ success: true, message: 'Menu updated successfully' });
    } catch (error) {
        console.error('Update menu error:', error);
        res.status(500).json({ success: false, error: 'Failed to update menu' });
    }
});

// Delete menu
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        if (!db) throw new Error('DB not connected');

        // Handle both numeric ID (legacy) and ObjectId
        const query = isNaN(Number(id)) ? { _id: new ObjectId(id) } : { id: Number(id) };

        const result = await db.collection('menus').deleteOne(query as any);

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Menu not found' });
        }

        res.json({ success: true, message: 'Menu deleted successfully' });
    } catch (error) {
        console.error('Delete menu error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete menu' });
    }
});

export default router;
