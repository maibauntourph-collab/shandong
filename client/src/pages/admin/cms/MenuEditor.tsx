import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import './CMS.css';

interface MenuItem {
    id: number;
    category: string;
    name: { ko: string; en: string };
    subtitle: { ko: string; en: string };
    description: { ko: string; en: string };
    price: string;
    image: string;
    featured: boolean;
}

const MenuEditor: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [sha, setSha] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const contentPath = 'content/menu/items.json';

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/cms/content/${contentPath}?metadata=true`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await response.json();
            const decodedContent = decodeURIComponent(escape(atob(data.content)));
            setItems(JSON.parse(decodedContent));
            setSha(data.sha);
        } catch (err: any) {
            setError('Failed to load menu items.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/cms/content/${contentPath}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    content: JSON.stringify(items, null, 2),
                    message: `CMS: Update ${contentPath}`,
                    sha: sha
                })
            });
            if (!response.ok) throw new Error('Save failed');
            const result = await response.json();
            setSha(result.content.sha);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const updateItem = (index: number, nested: string, lang: 'ko' | 'en' | null, value: any) => {
        const newItems = [...items];
        if (lang) {
            (newItems[index] as any)[nested][lang] = value;
        } else {
            (newItems[index] as any)[nested] = value;
        }
        setItems(newItems);
    };

    if (loading) return <div className="cms-loading">Loading Menu Database...</div>;

    return (
        <div className="cms-editor">
            <div className="cms-header">
                <div>
                    <h1>Menu Items Database</h1>
                    <p>Manage the full menu catalog with multi-language support (KO/EN).</p>
                </div>
                <div className="cms-actions">
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Publish to Live'}
                    </button>
                </div>
            </div>

            {error && <div className="cms-error-banner">{error}</div>}
            {success && <div className="cms-success-banner">Menu successfully updated!</div>}

            <div className="cms-content-list">
                {items.map((item, index) => (
                    <div key={item.id} className="cms-item-card">
                        <div className="item-header">
                            <h3>{item.name.en || 'New Item'}</h3>
                        </div>
                        <div className="cms-form-grid">
                            <div className="form-group">
                                <label>Name (KO)</label>
                                <input value={item.name.ko} onChange={e => updateItem(index, 'name', 'ko', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Name (EN)</label>
                                <input value={item.name.en} onChange={e => updateItem(index, 'name', 'en', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input value={item.category} onChange={e => updateItem(index, 'category', null, e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input value={item.price} onChange={e => updateItem(index, 'price', null, e.target.value)} />
                            </div>
                            <div className="form-group full-width">
                                <label>Image URL</label>
                                <input value={item.image} onChange={e => updateItem(index, 'image', null, e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuEditor;
