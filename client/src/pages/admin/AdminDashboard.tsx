import { api } from '../../lib/api';

// ... imports

const fetchDashboardData = async () => {
    try {
        const response = await api.get('/api/admin/stats');
        const data = await response.json();

        if (data.success) {
            setStats(data.data.stats);
            setRecentInquiries(data.data.recentInquiries);
        }
    } catch (error) {
        console.error('Dashboard fetch error:', error);
    } finally {
        setIsLoading(false);
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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

if (isLoading) {
    return (
        <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>로딩 중...</p>
        </div>
    );
}

return (
    <div className="admin-dashboard">
        <div className="admin-page-header">
            <h1 className="admin-page-title">대시보드</h1>
            <p className="admin-page-subtitle">산동 레스토랑 관리자 페이지</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.totalInquiries || 0}</span>
                    <span className="stat-label">총 문의</span>
                </div>
            </div>

            <div className="stat-card highlight">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.pendingInquiries || 0}</span>
                    <span className="stat-label">대기중</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.totalCustomers || 0}</span>
                    <span className="stat-label">고객</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.totalDocuments || 0}</span>
                    <span className="stat-label">문서</span>
                </div>
            </div>
        </div>

        {/* Recent Inquiries */}
        <div className="admin-card recent-inquiries">
            <div className="card-header">
                <h2>최근 문의</h2>
                <Link href="/admin/inquiries" className="view-all-link">
                    전체보기 →
                </Link>
            </div>

            {recentInquiries.length === 0 ? (
                <div className="empty-state">
                    <p>아직 문의가 없습니다.</p>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>고객명</th>
                            <th>이메일</th>
                            <th>행사유형</th>
                            <th>상태</th>
                            <th>일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentInquiries.map((inquiry) => (
                            <tr key={inquiry._id}>
                                <td>{inquiry.name}</td>
                                <td>{inquiry.email}</td>
                                <td>{inquiry.eventType}</td>
                                <td>
                                    <span className={`status-badge ${inquiry.status}`}>
                                        {getStatusLabel(inquiry.status)}
                                    </span>
                                </td>
                                <td>{formatDate(inquiry.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
            <h2>빠른 작업</h2>
            <div className="action-grid">
                <Link href="/admin/documents" className="action-card">
                    <span className="action-icon">📤</span>
                    <span className="action-label">문서 업로드</span>
                </Link>
                <Link href="/admin/inquiries" className="action-card">
                    <span className="action-icon">✉️</span>
                    <span className="action-label">문의 관리</span>
                </Link>
                <Link href="/admin/customers" className="action-card">
                    <span className="action-icon">👤</span>
                    <span className="action-label">고객 관리</span>
                </Link>
                <Link href="/admin/notices" className="action-card">
                    <span className="action-icon">📢</span>
                    <span className="action-label">공지 작성</span>
                </Link>
            </div>
        </div>
    </div>
);
};

export default AdminDashboard;
