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
                    <h1>관리자 대시보드</h1>
                    <div className="top-bar-actions">
                        <button className="refresh-btn" onClick={handleRefresh}>
                            🔄 새로고침
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
