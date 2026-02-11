import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminDashboard.css';

interface ActionStats {
    pendingOrders: {
        count: number;
        newestName: string | null;
        newestDate: string | null;
    };
    menuAlerts: {
        soldOutCount: number;
        items: string[];
    };
    upcomingEvents: {
        thisWeek: number;
        today: number;
        nextEvent: string | null;
    };
    lowStock: {
        count: number;
        items: { name: string; quantity: number; unit: string; threshold: number }[];
    };
    todayPriorities: any[];
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<ActionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        fetchActionStats();
    }, []);

    const fetchActionStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) { navigate('/admin/login'); return; }

            const response = await fetch('/api/admin/action-stats', {
                headers: { 'Authorization': `Bearer ${token}` },
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

            const result = await response.json();
            if (result.success) setData(result.data);
        } catch (err: any) {
            console.error('Dashboard error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; className: string }> = {
            pending: { label: '대기중', className: 'badge-pending' },
            contacted: { label: '연락완료', className: 'badge-contacted' },
            confirmed: { label: '확정', className: 'badge-confirmed' },
            completed: { label: '완료', className: 'badge-completed' },
        };
        return map[status] || { label: status, className: '' };
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Page Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        Dashboard <span className="title-sub">대시보드</span>
                    </h1>
                    <p className="dashboard-greeting">
                        {auth.username}님, 오늘 처리할 사항을 확인하세요.
                    </p>
                </div>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
                    })}
                </div>
            </div>

            {error && (
                <div className="status-banner status-error" style={{ marginBottom: '1.5rem' }}>
                    ⚠️ {error}
                </div>
            )}

            {data && (
                <>
                    {/* Action Cards Grid */}
                    <div className="action-grid">
                        {/* Card 1: Pending Orders */}
                        <div className={`action-card ${data.pendingOrders.count > 0 ? 'action-card--danger' : 'action-card--success'}`}>
                            <div className="action-card-top">
                                <span className="action-card-icon">📋</span>
                                <div className="action-card-info">
                                    <h3>Pending Orders <span className="card-sub">대기 주문</span></h3>
                                    <p className="action-card-status">
                                        {data.pendingOrders.count > 0
                                            ? `${data.pendingOrders.count}건의 새 문의가 있습니다`
                                            : '처리할 문의 없음 ✓'}
                                    </p>
                                    {data.pendingOrders.newestName && (
                                        <p className="action-card-detail">
                                            최신: {data.pendingOrders.newestName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                className="action-card-btn"
                                onClick={() => navigate('/admin/inquiries?status=pending')}
                            >
                                Review Orders →
                            </button>
                        </div>

                        {/* Card 2: Menu Status */}
                        <div className={`action-card ${data.menuAlerts.soldOutCount > 0 ? 'action-card--warning' : 'action-card--success'}`}>
                            <div className="action-card-top">
                                <span className="action-card-icon">🍽️</span>
                                <div className="action-card-info">
                                    <h3>Menu Status <span className="card-sub">메뉴 상태</span></h3>
                                    <p className="action-card-status">
                                        {data.menuAlerts.soldOutCount > 0
                                            ? `${data.menuAlerts.soldOutCount}개 메뉴 품절 상태`
                                            : '모든 메뉴 정상 ✓'}
                                    </p>
                                    {data.menuAlerts.items.length > 0 && (
                                        <p className="action-card-detail">
                                            {data.menuAlerts.items[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                className="action-card-btn"
                                onClick={() => navigate('/admin/menus')}
                            >
                                Check Menu →
                            </button>
                        </div>

                        {/* Card 3: Upcoming Events */}
                        <div className={`action-card ${data.upcomingEvents.today > 0 ? 'action-card--info' : data.upcomingEvents.thisWeek > 0 ? 'action-card--info' : 'action-card--neutral'}`}>
                            <div className="action-card-top">
                                <span className="action-card-icon">📅</span>
                                <div className="action-card-info">
                                    <h3>Upcoming Events <span className="card-sub">예정 행사</span></h3>
                                    <p className="action-card-status">
                                        {data.upcomingEvents.today > 0
                                            ? `오늘 행사 ${data.upcomingEvents.today}건`
                                            : data.upcomingEvents.thisWeek > 0
                                                ? `이번 주 예약 ${data.upcomingEvents.thisWeek}건`
                                                : '예정된 행사 없음'}
                                    </p>
                                    {data.upcomingEvents.nextEvent && (
                                        <p className="action-card-detail">
                                            다음: {new Date(data.upcomingEvents.nextEvent).toLocaleDateString('ko-KR')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                className="action-card-btn"
                                onClick={() => navigate('/admin/calendar')}
                            >
                                View Calendar →
                            </button>
                        </div>

                        {/* Card 4: Low Stock */}
                        {auth.canViewInventory && (
                            <div className={`action-card ${data.lowStock.count > 0 ? 'action-card--danger' : 'action-card--success'}`}>
                                <div className="action-card-top">
                                    <span className="action-card-icon">📦</span>
                                    <div className="action-card-info">
                                        <h3>Low Stock <span className="card-sub">재고 부족</span></h3>
                                        <p className="action-card-status">
                                            {data.lowStock.count > 0
                                                ? `재고 부족 ${data.lowStock.count}건`
                                                : '재고 충분 ✓'}
                                        </p>
                                        {data.lowStock.items.length > 0 && (
                                            <p className="action-card-detail">
                                                {data.lowStock.items[0].name}: {data.lowStock.items[0].quantity}{data.lowStock.items[0].unit}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="action-card-btn"
                                    onClick={() => navigate('/admin/inventory')}
                                >
                                    Manage Stock →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Today's Priorities */}
                    <div className="admin-card priorities-card">
                        <div className="card-header">
                            <h2>Today's Priorities <span className="title-sub">오늘의 할 일</span></h2>
                            <a href="/admin/inquiries" className="view-all-btn">View All →</a>
                        </div>

                        {data.todayPriorities.length > 0 ? (
                            <div className="priorities-list">
                                {data.todayPriorities.map((item: any) => {
                                    const badge = getStatusBadge(item.status);
                                    const isPending = item.status === 'pending';
                                    return (
                                        <div
                                            key={item._id}
                                            className={`priority-item ${isPending ? 'priority--urgent' : ''}`}
                                            onClick={() => navigate(`/admin/inquiries`)}
                                        >
                                            <div className="priority-left">
                                                <span className={`priority-dot ${isPending ? 'dot--red' : 'dot--blue'}`}></span>
                                                <div>
                                                    <span className="priority-name">{item.name}</span>
                                                    <span className="priority-meta">
                                                        {item.eventType} · {item.guestCount}명
                                                        {item.eventDate && ` · ${new Date(item.eventDate).toLocaleDateString('ko-KR')}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="priority-right">
                                                <span className={`priority-badge ${badge.className}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>🎉 오늘은 처리할 사항이 없습니다!</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;