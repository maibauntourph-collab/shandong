import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load admin pages
const AdminInquiries = React.lazy(() => import('./pages/admin/AdminInquiries'));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers'));
const AdminDocuments = React.lazy(() => import('./pages/admin/AdminDocuments'));
const AdminNotices = React.lazy(() => import('./pages/admin/AdminNotices'));
const AdminMenus = React.lazy(() => import('./pages/admin/AdminMenus'));
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/login" element={<Login />} />

                {/* Admin Routes with Layout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route
                        path="/admin/inquiries"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <AdminInquiries />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="/admin/customers"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <AdminCustomers />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="/admin/documents"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <AdminDocuments />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="/admin/notices"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <AdminNotices />
                            </React.Suspense>
                        }
                    />
                    <Route
                        path="/admin/menus"
                        element={
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <AdminMenus />
                            </React.Suspense>
                        }
                    />
                </Route>

                <Route path="/" element={<Navigate to="/admin/login" />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;