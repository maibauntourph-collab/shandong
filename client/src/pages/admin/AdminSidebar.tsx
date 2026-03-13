import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminSidebar.css';

// Menu items with optional role requirements
const allMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', sub: '대시보드', icon: '📊', roles: null },
    { path: '/admin/menus', label: 'Menus', sub: '메뉴', icon: '🍽️', roles: null },
    { path: '/admin/inquiries', label: 'Orders', sub: '주문', icon: '📋', roles: null },
    { path: '/admin/calendar', label: 'Calendar', sub: '달력', icon: '📅', roles: null },
    { path: '/admin/cms/dishes', label: 'CMS: Dishes', sub: '대표 메뉴 관리', icon: '🍛', roles: ['owner'] },
    { path: '/admin/cms/menu', label: 'CMS: Menu Items', sub: '전체 메뉴 관리', icon: '📖', roles: ['owner'] },
    { path: '/admin/cms/home', label: 'CMS: Homepage', sub: '홈페이지 관리', icon: '🏠', roles: ['owner'] },
    { path: '/admin/customers', label: 'Customers', sub: '고객', icon: '👥', roles: ['owner', 'manager'] },
    { path: '/admin/inventory', label: 'Inventory', sub: '재고', icon: '📦', roles: ['owner', 'manager'] },
    { path: '/admin/analytics', label: 'Analytics', sub: '분석', icon: '📈', roles: ['owner', 'manager'] },
    { path: '/admin/gallery', label: 'Gallery', sub: '갤러리', icon: '🖼️', roles: ['owner', 'manager'] },
    { path: '/admin/documents', label: 'Documents', sub: '문서', icon: '📄', roles: ['owner', 'manager'] },
    { path: '/admin/notices', label: 'Notices', sub: '공지', icon: '📢', roles: ['owner', 'manager'] },
    { path: '/admin/settings', label: 'Settings', sub: '설정', icon: '⚙️', roles: ['owner'] },
];

const roleLabels: Record<string, string> = {
    owner: '대표',
    manager: '매니저',
    staff: '스태프',
    admin: '대표',
};

const AdminSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();

    // Filter menu items by role
    const visibleItems = allMenuItems.filter(item =>
        item.roles === null || item.roles.includes(auth.role)
    );

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🥟</span>
                    <span className="logo-text">Shandong</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {visibleItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{auth.username.charAt(0).toUpperCase()}</div>
                    <div className="user-details">
                        <p className="user-name">{auth.username}</p>
                        <p className="user-role">{roleLabels[auth.role] || auth.role}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <span>🚪</span> Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
