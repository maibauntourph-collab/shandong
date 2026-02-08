import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/login" element={<Login />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/inquiries"
                    element={
                        <ProtectedRoute>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/AdminInquiries')))}
                            </React.Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/customers"
                    element={
                        <ProtectedRoute>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/AdminCustomers')))}
                            </React.Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/documents"
                    element={
                        <ProtectedRoute>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/AdminDocuments')))}
                            </React.Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/notices"
                    element={
                        <ProtectedRoute>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/AdminNotices')))}
                            </React.Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/menus"
                    element={
                        <ProtectedRoute>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/AdminMenus')))}
                            </React.Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/admin/login" />} />
                <Route path="/admin" element={<Navigate to="/admin/login" />} />
            </Routes>
        </Router>
    );
}

export default App;