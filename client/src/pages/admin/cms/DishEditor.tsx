import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import './CMS.css';

interface Dish {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    featured: boolean;
}

const DishEditor: React.FC = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [sha, setSha] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const contentPath = 'content/dishes/signature.json';
    const FALLBACK_IMAGE = '/assets/fallback-dish.jpg';

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            // Fetch with metadata to get SHA
            const response = await fetch(`/api/cms/content/${contentPath}?metadata=true`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await response.json();

            // GitHub returns content as base64 in the metadata response
            const decodedContent = decodeURIComponent(escape(atob(data.content)));
            setDishes(JSON.parse(decodedContent));
            setSha(data.sha);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching dishes:', err);
            setError('Failed to load dishes from GitHub. Make sure GITHUB_TOKEN is set.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDish = (index: number, field: keyof Dish, value: any) => {
        const newDishes = [...dishes];
        newDishes[index] = { ...newDishes[index], [field]: value };
        setDishes(newDishes);
    };

    const handleAddDish = () => {
        const newDish: Dish = {
            id: `dish-${Date.now()}`,
            name: '',
            description: '',
            price: '',
            image: '',
            category: 'Signature',
            featured: false
        };
        setDishes([...dishes, newDish]);
    };

    const handleRemoveDish = (index: number) => {
        setDishes(dishes.filter((_, i) => i !== index));
    };

    const validate = () => {
        for (const dish of dishes) {
            if (!dish.name || !dish.price || !dish.image) {
                setError(`Validation Error: Dish "${dish.name || 'Unnamed'}" must have a name, price, and image.`);
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        setSuccess(false);
        setError(null);

        try {
            // Requirement #4: Image validation with fallback
            const validatedDishes = dishes.map(dish => ({
                ...dish,
                image: dish.image.trim() === '' ? FALLBACK_IMAGE : dish.image
            }));

            const response = await fetch(`/api/cms/content/${contentPath}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    content: JSON.stringify(validatedDishes, null, 2),
                    message: `CMS: Update ${contentPath} via Admin Portal`,
                    sha: sha
                })
            });

            const result = await response.json();
            if (response.ok) {
                setSha(result.content.sha);
                setSuccess(true);
                setDishes(validatedDishes);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                throw new Error(result.error || 'Failed to save to GitHub');
            }
        } catch (err: any) {
            console.error('Error saving dishes:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="cms-loading">Loading from GitHub...</div>;

    return (
        <div className="cms-editor">
            <div className="cms-header">
                <div>
                    <h1>Signature Dishes Manager</h1>
                    <p>Edit the dishes that appear on the homepage. Changes are committed directly to GitHub.</p>
                </div>
                <div className="cms-actions">
                    <button
                        className={`btn-preview ${previewMode ? 'active' : ''}`}
                        onClick={() => setPreviewMode(!previewMode)}
                    >
                        {previewMode ? 'Edit Mode' : '👁️ Preview'}
                    </button>
                    <button
                        className="btn-save"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Committing...' : '🚀 Publish Changes'}
                    </button>
                </div>
            </div>

            {error && <div className="cms-error-banner">⚠️ {error}</div>}
            {success && <div className="cms-success-banner">✅ Changes committed to GitHub successfully! Deployment started.</div>}

            {previewMode ? (
                <div className="cms-preview-frame">
                    <div className="preview-header">
                        <span>Preview: preview.shandongrestaurant.com</span>
                    </div>
                    <div className="dish-grid-preview">
                        {dishes.map((dish, i) => (
                            <div key={dish.id} className="preview-card">
                                <img src={dish.image || FALLBACK_IMAGE} alt={dish.name} />
                                <div className="preview-content">
                                    <h3>{dish.name}</h3>
                                    <p className="price">{dish.price}</p>
                                    <p>{dish.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="cms-content-list">
                    {dishes.map((dish, index) => (
                        <div key={dish.id} className="cms-item-card">
                            <div className="item-header">
                                <h3>Dish #{index + 1}</h3>
                                <button className="btn-remove" onClick={() => handleRemoveDish(index)}>Delete</button>
                            </div>
                            <div className="cms-form-grid">
                                <div className="form-group">
                                    <label>Name (Required)</label>
                                    <input
                                        type="text"
                                        value={dish.name}
                                        onChange={e => handleUpdateDish(index, 'name', e.target.value)}
                                        placeholder="e.g. Crispy Tangsuyuk"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price (Required)</label>
                                    <input
                                        type="text"
                                        value={dish.price}
                                        onChange={e => handleUpdateDish(index, 'price', e.target.value)}
                                        placeholder="e.g. ₱800"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={dish.description}
                                        onChange={e => handleUpdateDish(index, 'description', e.target.value)}
                                        placeholder="Enter a mouth-watering description..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Image Path or URL (Required)</label>
                                    <input
                                        type="text"
                                        value={dish.image}
                                        onChange={e => handleUpdateDish(index, 'image', e.target.value)}
                                        placeholder="/images/dish-name.jpg"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={dish.category}
                                        onChange={e => handleUpdateDish(index, 'category', e.target.value)}
                                    >
                                        <option value="Signature">Signature</option>
                                        <option value="Package">Package</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={dish.featured}
                                            onChange={e => handleUpdateDish(index, 'featured', e.target.checked)}
                                        />
                                        Featured on Homepage
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={handleAddDish}>+ Add New Dish</button>
                </div>
            )}
        </div>
    );
};

export default DishEditor;
