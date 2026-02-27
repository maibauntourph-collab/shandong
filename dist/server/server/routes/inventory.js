"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../db.js");
const mongodb_1 = require("mongodb");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticateToken);
router.use((0, auth_js_1.requireRole)('owner', 'manager'));
// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const db = (0, db_js_1.getDB)();
        if (!db)
            return res.status(500).json({ success: false, error: 'DB error' });
        const items = await db.collection('inventory').find({}).sort({ name: 1 }).toArray();
        res.json({ success: true, data: items });
    }
    catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch inventory' });
    }
});
const zod_1 = require("zod");
const itemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    quantity: zod_1.z.number().min(0),
    unit: zod_1.z.string(),
    threshold: zod_1.z.number().min(0).optional(),
    category: zod_1.z.string().optional()
});
// Add item
router.post('/', async (req, res) => {
    try {
        const validation = itemSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error.message });
        }
        const { name, quantity, unit, threshold, category } = req.body;
        const db = (0, db_js_1.getDB)();
        if (!db)
            return res.status(500).json({ success: false, error: 'DB error' });
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to add item' });
    }
});
// Update item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, unit, threshold, category } = req.body;
        const db = (0, db_js_1.getDB)();
        if (!db)
            return res.status(500).json({ success: false, error: 'DB error' });
        const updateData = { lastUpdated: new Date() };
        if (name)
            updateData.name = name;
        if (quantity !== undefined)
            updateData.quantity = Number(quantity);
        if (unit)
            updateData.unit = unit;
        if (threshold !== undefined)
            updateData.threshold = Number(threshold);
        if (category)
            updateData.category = category;
        await db.collection('inventory').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData });
        res.json({ success: true, message: 'Item updated' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
});
// Delete item (owner only)
router.delete('/:id', (0, auth_js_1.requireRole)('owner'), async (req, res) => {
    try {
        const { id } = req.params;
        const db = (0, db_js_1.getDB)();
        if (!db)
            return res.status(500).json({ success: false, error: 'DB error' });
        await db.collection('inventory').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        res.json({ success: true, message: 'Item deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
});
exports.default = router;
