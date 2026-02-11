import { Router } from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken as any);
router.use(requireRole('owner', 'manager') as any);

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        if (!db) return res.status(500).json({ success: false, error: 'DB error' });

        const items = await db.collection('inventory').find({}).sort({ name: 1 }).toArray();
        res.json({ success: true, data: items });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch inventory' });
    }
});

import { z } from 'zod';

const itemSchema = z.object({
    name: z.string().min(1),
    quantity: z.number().min(0),
    unit: z.string(),
    threshold: z.number().min(0).optional(),
    category: z.string().optional()
});

// Add item
router.post('/', async (req, res) => {
    try {
        const validation = itemSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error.message });
        }

        const { name, quantity, unit, threshold, category } = req.body;
        const db = getDB();
        if (!db) return res.status(500).json({ success: false, error: 'DB error' });

        const newItem = {
            name,
            quantity: Number(quantity),
            unit,
            threshold: Number(threshold) || 10,
            category: category || 'general',
            lastUpdated: new Date()
        };

        const result = await db.collection('inventory').insertOne(newItem);
        res.status(201).json({ success: true, data: { ...newItem, _id: result.insertedId } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to add item' });
    }
});

// Update item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, unit, threshold, category } = req.body;
        const db = getDB();
        if (!db) return res.status(500).json({ success: false, error: 'DB error' });

        const updateData: any = { lastUpdated: new Date() };
        if (name) updateData.name = name;
        if (quantity !== undefined) updateData.quantity = Number(quantity);
        if (unit) updateData.unit = unit;
        if (threshold !== undefined) updateData.threshold = Number(threshold);
        if (category) updateData.category = category;

        await db.collection('inventory').updateOne(
            { _id: new ObjectId(id) } as any,
            { $set: updateData }
        );

        res.json({ success: true, message: 'Item updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
});

// Delete item (owner only)
router.delete('/:id', requireRole('owner') as any, async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        if (!db) return res.status(500).json({ success: false, error: 'DB error' });

        await db.collection('inventory').deleteOne({ _id: new ObjectId(id) } as any);
        res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
});

export default router;
