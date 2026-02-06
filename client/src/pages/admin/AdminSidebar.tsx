import { Link, useLocation } from 'wouter';
import { useAuth } from './AdminLayout';
import './AdminSidebar.css';

const menuItems = [
    { path: '/admin', label: '대시보드', icon: '📊' },
    { path: '/admin/inquiries', label: '예약/문의 관리', icon: '📝' },
    { path: '/admin/menus', label: '메뉴 관리', icon: '🍽️' },
    { path: '/admin/customers', label: '고객 관리', icon: '👥' },
    { path: '/admin/documents', label: '문서/벡터DB', icon: '📁' },
    { path: '/admin/notices', label: '게시판 관리', icon: '📢' },
];

const AdminSidebar = () => {
    const [location] = useLocation();
    const { user, logout } = useAuth();

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <Link href="/" className="sidebar-logo">
                    🥢 <span>산동 레스토랑</span>
                </Link>
                <span className="sidebar-badge">Admin</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`sidebar-link ${location === item.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="user-avatar">👤</div>
                    <div className="user-info">
                        <span className="user-name">{user?.username || 'Admin'}</span>
                        <span className="user-role">{user?.role || 'Administrator'}</span>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={logout}>
                    로그아웃
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
