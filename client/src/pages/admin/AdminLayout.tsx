import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        navigate(0);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="main-content">
                <header className="top-bar">
                    <h1>Admin Dashboard</h1>
                    <div className="top-bar-actions">
                        <button className="refresh-btn" onClick={handleRefresh}>
                            🔄 Refresh
                        </button>
                    </div>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
