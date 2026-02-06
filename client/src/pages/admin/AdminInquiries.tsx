import { useEffect, useState } from 'react';
import './AdminInquiries.css';

interface Inquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    guestCount: number;
    eventType: string;
    budget: string;
    message: string;
    status: string;
    notes?: string;
    createdAt: string;
}

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, [filter]);

    const fetchInquiries = async () => {
        try {
            const url = filter === 'all'
                ? '/api/inquiries'
                : `/api/inquiries?status=${filter}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setInquiries(data.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchInquiries();
                if (selectedInquiry?._id === id) {
                    setSelectedInquiry({ ...selectedInquiry, status });
                }
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: '대기중',
            contacted: '연락완료',
            confirmed: '확정',
            completed: '완료',
        };
        return labels[status] || status;
    };

    return (
        <div className="admin-inquiries">
            <div className="admin-page-header">
                <h1 className="admin-page-title">예약/문의 관리</h1>
                <p className="admin-page-subtitle">고객 문의 및 예약을 관리합니다</p>
            </div>

            {/* Filters */}
            <div className="inquiry-filters">
                {['all', 'pending', 'contacted', 'confirmed', 'completed'].map((status) => (
                    <button
                        key={status}
                        className={`filter-btn ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status === 'all' ? '전체' : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            <div className="inquiry-layout">
                {/* List */}
                <div className="admin-card inquiry-list">
                    {isLoading ? (
                        <div className="loading">로딩 중...</div>
                    ) : inquiries.length === 0 ? (
                        <div className="empty-state">문의가 없습니다.</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>고객명</th>
                                    <th>행사유형</th>
                                    <th>날짜</th>
                                    <th>인원</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map((inquiry) => (
                                    <tr
                                        key={inquiry._id}
                                        className={selectedInquiry?._id === inquiry._id ? 'selected' : ''}
                                        onClick={() => setSelectedInquiry(inquiry)}
                                    >
                                        <td>{inquiry.name}</td>
                                        <td>{inquiry.eventType}</td>
                                        <td>{formatDate(inquiry.eventDate)}</td>
                                        <td>{inquiry.guestCount}명</td>
                                        <td>
                                            <span className={`status-badge ${inquiry.status}`}>
                                                {getStatusLabel(inquiry.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Detail Panel */}
                {selectedInquiry && (
                    <div className="admin-card inquiry-detail">
                        <h3>문의 상세</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>고객명</label>
                                <p>{selectedInquiry.name}</p>
                            </div>
                            <div className="detail-item">
                                <label>이메일</label>
                                <p>{selectedInquiry.email}</p>
                            </div>
                            <div className="detail-item">
                                <label>연락처</label>
                                <p>{selectedInquiry.phone}</p>
                            </div>
                            <div className="detail-item">
                                <label>행사유형</label>
                                <p>{selectedInquiry.eventType}</p>
                            </div>
                            <div className="detail-item">
                                <label>행사일</label>
                                <p>{formatDate(selectedInquiry.eventDate)}</p>
                            </div>
                            <div className="detail-item">
                                <label>예상인원</label>
                                <p>{selectedInquiry.guestCount}명</p>
                            </div>
                            <div className="detail-item">
                                <label>예산</label>
                                <p>{selectedInquiry.budget}</p>
                            </div>
                            <div className="detail-item full">
                                <label>요청사항</label>
                                <p>{selectedInquiry.message || '없음'}</p>
                            </div>
                        </div>

                        <div className="status-actions">
                            <label>상태 변경</label>
                            <div className="status-buttons">
                                {['pending', 'contacted', 'confirmed', 'completed'].map((status) => (
                                    <button
                                        key={status}
                                        className={`status-btn ${status} ${selectedInquiry.status === status ? 'active' : ''}`}
                                        onClick={() => updateStatus(selectedInquiry._id, status)}
                                    >
                                        {getStatusLabel(status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInquiries;
