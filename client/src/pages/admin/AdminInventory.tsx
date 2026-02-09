import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import './AdminInventory.css';
import { InventoryItem } from '@shared/types';

const AdminInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('all');

    // Form state
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
        unit: 'ea',
        threshold: 10,
        category: 'general'
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/api/inventory');
            const data = await response.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `/api/inventory/${isEditing}`
                : '/api/inventory';

            const method = isEditing ? api.put : api.post;

            const response = await method(url, formData);
            const data = await response.json();

            if (data.success) {
                fetchInventory();
                resetForm();
                alert(isEditing ? 'Item updated' : 'Item added');
            } else {
                alert('Operation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const response = await api.delete(`/api/inventory/${id}`);
            const data = await response.json(); // Wait for data
            if (data.success) {
                setItems(items.filter(i => i._id !== id));
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ name: '', quantity: 0, unit: 'ea', threshold: 10, category: 'general' });
    };

    const startEdit = (item: InventoryItem) => {
        if (!item._id) return;
        setIsEditing(item._id);
        setFormData({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            threshold: item.threshold,
            category: item.category
        });
    };

    const filteredItems = filterCategory === 'all'
        ? items
        : items.filter(i => i.category === filterCategory);

    return (
        <div className="admin-inventory">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Inventory <span className="sub-text">재고 관리</span></h1>
                    <p className="admin-page-subtitle">Track ingredients and equipment stock.</p>
                </div>
            </div>

            <div className="inventory-layout">
                {/* Form Section */}
                <div className="admin-card form-section">
                    <h3>{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Name (품명)</label>
                            <input
                                type="text"
                                className="admin-input"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Quantity (수량)</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    required
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Unit (단위)</label>
                                <select
                                    className="admin-select"
                                    value={formData.unit}
                                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                >
                                    <option value="ea">ea (개)</option>
                                    <option value="kg">kg</option>
                                    <option value="L">L</option>
                                    <option value="box">box</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Threshold (최소재고)</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    value={formData.threshold}
                                    onChange={e => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="admin-select"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="general">General</option>
                                    <option value="ingredient">Ingredient</option>
                                    <option value="equipment">Equipment</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            {isEditing && (
                                <button type="button" className="admin-button secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="admin-button">
                                {isEditing ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="admin-card list-section">
                    <div className="list-header">
                        <div className="filters">
                            <button className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>All</button>
                            <button className={`filter-btn ${filterCategory === 'ingredient' ? 'active' : ''}`} onClick={() => setFilterCategory('ingredient')}>Ingredients</button>
                            <button className={`filter-btn ${filterCategory === 'equipment' ? 'active' : ''}`} onClick={() => setFilterCategory('equipment')}>Equipment</button>
                        </div>
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center">Loading...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={5} className="text-center">No items found.</td></tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity} {item.unit}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            {item.quantity <= item.threshold ? (
                                                <span className="status-badge status-pending">Low Stock</span>
                                            ) : (
                                                <span className="status-badge status-confirmed">OK</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className="icon-btn" onClick={() => startEdit(item)}>✏️</button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(item._id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInventory;
