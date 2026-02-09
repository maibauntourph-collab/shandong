import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/menus', label: 'Menus', icon: '🍽️' },
    { path: '/admin/inquiries', label: 'Orders', icon: '📋' },
    { path: '/admin/customers', label: 'Customers', icon: '👥' },
    { path: '/admin/calendar', label: 'Catering (Calendar)', icon: '📅' },
    { path: '/admin/inventory', label: 'Inventory', icon: '📦' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/admin/documents', label: 'Documents', icon: '📄' },
    { path: '/admin/notices', label: 'Notices', icon: '📢' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const AdminSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get user info from localStorage
    const userStr = localStorage.getItem('adminUser');
    const user = userStr ? JSON.parse(userStr) : { username: 'Admin', role: '관리자' };

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
                {menuItems.map((item) => (
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
                    <div className="user-avatar">A</div>
                    <div className="user-details">
                        <p className="user-name">{user.username}</p>
                        <p className="user-role">{user.role}</p>
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
