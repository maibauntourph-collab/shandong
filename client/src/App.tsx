import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Client Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import MainLayout from './components/layout/MainLayout';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy load admin pages
const AdminInquiries = React.lazy(() => import('./pages/admin/AdminInquiries'));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers'));
const AdminDocuments = React.lazy(() => import('./pages/admin/AdminDocuments'));
const AdminNotices = React.lazy(() => import('./pages/admin/AdminNotices'));
const AdminMenus = React.lazy(() => import('./pages/admin/AdminMenus'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminCalendar = React.lazy(() => import('./pages/admin/AdminCalendar'));
const AdminGallery = React.lazy(() => import('./pages/admin/AdminGallery'));
const AdminInventory = React.lazy(() => import('./pages/admin/AdminInventory'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
import './App.css';

function App() {
    return (
        <LanguageProvider>
            <Router>
                <Routes>
                    {/* Public Client Routes */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/quote" element={<Quote />} />
                        <Route path="/contact" element={<Contact />} />
                    </Route>

                    {/* Admin Login */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Admin Routes with Layout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
                        <Route
                            path="/admin/settings"
                            element={
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <AdminSettings />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="/admin/calendar"
                            element={
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <AdminCalendar />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="/admin/gallery"
                            element={
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <AdminGallery />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="/admin/inventory"
                            element={
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <AdminInventory />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="/admin/analytics"
                            element={
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    <AdminAnalytics />
                                </React.Suspense>
                            }
                        />
                    </Route>

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </LanguageProvider>
    );
}

export default App;
