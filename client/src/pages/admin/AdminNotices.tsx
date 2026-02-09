import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Notice {
    _id: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
}

const AdminNotices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Partial<Notice>>({});

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/api/admin/notices');
            const data = await response.json();
            if (data.success) {
                setNotices(data.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingNotice._id
                ? `/api/admin/notices/${editingNotice._id}`
                : '/api/admin/notices';

            const body = {
                title: editingNotice.title,
                content: editingNotice.content,
                isPublished: editingNotice.isPublished ?? true,
            };

            const response = editingNotice._id
                ? await api.put(url, body)
                : await api.post(url, body);

            if (response.ok) {
                fetchNotices();
                closeEditor();
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const deleteNotice = async (id: string) => {
        if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;

        try {
            const response = await api.delete(`/api/admin/notices/${id}`);

            if (response.ok) {
                fetchNotices();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const openEditor = (notice?: Notice) => {
        setEditingNotice(notice || { title: '', content: '', isPublished: true });
        setIsEditing(true);
    };

    const closeEditor = () => {
        setEditingNotice({});
        setIsEditing(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="admin-notices">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Notices <span className="sub-text">게시판 관리</span></h1>
                    <p className="admin-page-subtitle">Manage announcements and news.</p>
                </div>
                <button className="admin-button" onClick={() => openEditor()}>
                    + New Notice
                </button>
            </div>

            {/* Editor Modal */}
            {isEditing && (
                <div className="modal-overlay" onClick={closeEditor}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingNotice._id ? 'Edit Notice' : 'New Notice'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editingNotice.title || ''}
                                    onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                                    placeholder="Enter notice title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    value={editingNotice.content || ''}
                                    onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                                    placeholder="Enter notice content"
                                    rows={8}
                                    required
                                />
                            </div>
                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editingNotice.isPublished ?? true}
                                        onChange={(e) => setEditingNotice({ ...editingNotice, isPublished: e.target.checked })}
                                        style={{ width: 'auto', marginRight: '8px' }}
                                    />
                                    Publish Immediately (즉시 공개)
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="admin-button secondary" onClick={closeEditor}>Cancel</button>
                                <button type="submit" className="admin-button">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notice List */}
            <div className="admin-card">
                {isLoading ? (
                    <div className="admin-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : notices.length === 0 ? (
                    <div className="empty-state">
                        <p>No notices found.</p>
                    </div>
                ) : (
                    <div className="notice-list">
                        {notices.map((notice) => (
                            <div key={notice._id} className="notice-item">
                                <div className="notice-info">
                                    <div className="notice-header">
                                        <h4>{notice.title}</h4>
                                        {!notice.isPublished && (
                                            <span className="draft-badge">Draft (비공개)</span>
                                        )}
                                    </div>
                                    <p className="notice-preview">
                                        {notice.content.slice(0, 100)}
                                        {notice.content.length > 100 && '...'}
                                    </p>
                                    <span className="notice-date">{formatDate(notice.createdAt)}</span>
                                </div>
                                <div className="notice-actions">
                                    <button className="action-btn" onClick={() => openEditor(notice)} title="Edit">✏️</button>
                                    <button className="action-btn delete" onClick={() => deleteNotice(notice._id)} title="Delete">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotices;
