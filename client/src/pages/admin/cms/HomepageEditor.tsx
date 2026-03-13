import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import './CMS.css';

interface HomeContent {
    hero: {
        headline: string;
        subheadline: string;
        badge: string;
    };
    visit: {
        headline: string;
        copy: string;
    };
}

const HomepageEditor: React.FC = () => {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [sha, setSha] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const contentPath = 'content/homepage/content.json';

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
            setContent(JSON.parse(decodedContent));
            setSha(data.sha);
        } catch (err: any) {
            setError('Failed to load homepage content.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            const response = await fetch(`/api/cms/content/${contentPath}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    content: JSON.stringify(content, null, 2),
                    message: `CMS: Update Homepage Content`,
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

    if (loading) return <div className="cms-loading">Loading Homepage settings...</div>;
    if (!content) return null;

    return (
        <div className="cms-editor">
            <div className="cms-header">
                <div>
                    <h1>Homepage Content Manager</h1>
                    <p>Edit the text and headlines for the landing page hero and visit sections.</p>
                </div>
                <div className="cms-actions">
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Publishing...' : 'Publish to Live'}
                    </button>
                </div>
            </div>

            {error && <div className="cms-error-banner">{error}</div>}
            {success && <div className="cms-success-banner">Homepage updated! Deployment triggered.</div>}

            <div className="cms-content-list">
                <div className="cms-item-card">
                    <div className="item-header"><h3>Hero Section</h3></div>
                    <div className="cms-form-grid">
                        <div className="form-group full-width">
                            <label>Headline</label>
                            <input value={content.hero.headline} onChange={e => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })} />
                        </div>
                        <div className="form-group full-width">
                            <label>Subheadline</label>
                            <textarea value={content.hero.subheadline} onChange={e => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })} />
                        </div>
                        <div className="form-group">
                            <label>Badge Text</label>
                            <input value={content.hero.badge} onChange={e => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })} />
                        </div>
                    </div>
                </div>

                <div className="cms-item-card">
                    <div className="item-header"><h3>Visit Section</h3></div>
                    <div className="cms-form-grid">
                        <div className="form-group full-width">
                            <label>Headline</label>
                            <input value={content.visit.headline} onChange={e => setContent({ ...content, visit: { ...content.visit, headline: e.target.value } })} />
                        </div>
                        <div className="form-group full-width">
                            <label>Copy Text</label>
                            <textarea value={content.visit.copy} onChange={e => setContent({ ...content, visit: { ...content.visit, copy: e.target.value } })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomepageEditor;
