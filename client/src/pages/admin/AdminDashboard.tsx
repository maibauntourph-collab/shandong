import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

interface DashboardStats {
    totalInquiries: number;
    pendingInquiries: number;
    totalDocuments: number;
    totalCustomers: number;
}

interface RecentInquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                navigate('/admin/login');
                return;
            }

            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    navigate('/admin/login');
                    return;
                }
                throw new Error('데이터 로드 실패');
            }

            const data = await response.json();

            if (data.success) {
                setStats(data.data.stats);
                setRecentInquiries(data.data.recentInquiries);
            }
        } catch (err: any) {
            console.error('Dashboard error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: '대기중',
            confirmed: '확인됨',
            completed: '완료',
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status: string) => {
        return `status-${status}`;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">🥟</span>
                        <span className="logo-text">Shandong</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="/admin/dashboard" className="nav-item active">
                        <span className="nav-icon">📊</span>
                        <span>대시보드</span>
                    </a>
                    <a href="/admin/inquiries" className="nav-item">
                        <span className="nav-icon">📝</span>
                        <span>문의 관리</span>
                    </a>
                    <a href="/admin/customers" className="nav-item">
                        <span className="nav-icon">👥</span>
                        <span>고객 관리</span>
                    </a>
                    <a href="/admin/documents" className="nav-item">
                        <span className="nav-icon">📄</span>
                        <span>문서 관리</span>
                    </a>
                    <a href="/admin/notices" className="nav-item">
                        <span className="nav-icon">📢</span>
                        <span>공지사항</span>
                    </a>
                    <a href="/admin/settings" className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        <span>설정</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">A</div>
                        <div className="user-details">
                            <p className="user-name">Admin</p>
                            <p className="user-role">관리자</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>🚪</span> 로그아웃
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <h1>대시보드</h1>
                    <div className="top-bar-actions">
                        <button className="refresh-btn" onClick={fetchDashboardData}>
                            🔄 새로고침
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {error && (
                        <div className="error-banner">
                            ❌ {error}
                        </div>
                    )}

                    {/* Stats Grid */}
                    {stats && (
                        <div className="stats-grid">
                            <div className="stat-card" style={{ borderColor: '#4F46E5' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                                    📝
                                </div>
                                <div className="stat-content">
                                    <h3>전체 문의</h3>
                                    <p className="stat-value">{stats.totalInquiries}</p>
                                </div>
                            </div>

                            <div className="stat-card" style={{ borderColor: '#F59E0B' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                                    ⏳
                                </div>
                                <div className="stat-content">
                                    <h3>대기중 문의</h3>
                                    <p className="stat-value">{stats.pendingInquiries}</p>
                                </div>
                            </div>

                            <div className="stat-card" style={{ borderColor: '#10B981' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                                    👥
                                </div>
                                <div className="stat-content">
                                    <h3>전체 고객</h3>
                                    <p className="stat-value">{stats.totalCustomers}</p>
                                </div>
                            </div>

                            <div className="stat-card" style={{ borderColor: '#EF4444' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}>
                                    📄
                                </div>
                                <div className="stat-content">
                                    <h3>문서</h3>
                                    <p className="stat-value">{stats.totalDocuments}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Inquiries */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>최근 문의</h2>
                            <a href="/admin/inquiries" className="view-all-btn">전체보기 →</a>
                        </div>
                        <div className="inquiries-table">
                            {recentInquiries.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>이름</th>
                                            <th>이메일</th>
                                            <th>전화번호</th>
                                            <th>상태</th>
                                            <th>등록일</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentInquiries.map((inquiry) => (
                                            <tr key={inquiry._id}>
                                                <td>{inquiry.name}</td>
                                                <td>{inquiry.email}</td>
                                                <td>{inquiry.phone}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(inquiry.status)}`}>
                                                        {getStatusBadge(inquiry.status)}
                                                    </span>
                                                </td>
                                                <td>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">
                                    <p>문의 내역이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;