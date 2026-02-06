import { useEffect, useState } from 'react';
import './AdminNotices.css';

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
            const response = await fetch('/api/admin/notices');
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
            const method = editingNotice._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingNotice.title,
                    content: editingNotice.content,
                    isPublished: editingNotice.isPublished ?? true,
                }),
            });

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
            const response = await fetch(`/api/admin/notices/${id}`, {
                method: 'DELETE',
            });

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
                    <h1 className="admin-page-title">게시판 관리</h1>
                    <p className="admin-page-subtitle">공지사항 및 게시글을 관리합니다</p>
                </div>
                <button className="btn btn-primary" onClick={() => openEditor()}>
                    + 새 공지 작성
                </button>
            </div>

            {/* Editor Modal */}
            {isEditing && (
                <div className="modal-overlay" onClick={closeEditor}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingNotice._id ? '공지 수정' : '새 공지 작성'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>제목</label>
                                <input
                                    type="text"
                                    value={editingNotice.title || ''}
                                    onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                                    placeholder="공지 제목"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>내용</label>
                                <textarea
                                    value={editingNotice.content || ''}
                                    onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                                    placeholder="공지 내용"
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
                                    />
                                    공개
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn" onClick={closeEditor}>취소</button>
                                <button type="submit" className="btn btn-primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notice List */}
            <div className="admin-card">
                {isLoading ? (
                    <div className="loading">로딩 중...</div>
                ) : notices.length === 0 ? (
                    <div className="empty-state">
                        <p>등록된 공지사항이 없습니다.</p>
                    </div>
                ) : (
                    <div className="notice-list">
                        {notices.map((notice) => (
                            <div key={notice._id} className="notice-item">
                                <div className="notice-info">
                                    <div className="notice-header">
                                        <h4>{notice.title}</h4>
                                        {!notice.isPublished && (
                                            <span className="draft-badge">비공개</span>
                                        )}
                                    </div>
                                    <p className="notice-preview">
                                        {notice.content.slice(0, 100)}
                                        {notice.content.length > 100 && '...'}
                                    </p>
                                    <span className="notice-date">{formatDate(notice.createdAt)}</span>
                                </div>
                                <div className="notice-actions">
                                    <button className="action-btn" onClick={() => openEditor(notice)}>✏️</button>
                                    <button className="action-btn delete" onClick={() => deleteNotice(notice._id)}>🗑️</button>
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
