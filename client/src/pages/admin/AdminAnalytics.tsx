import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AdminAnalytics.css';

interface AnalyticsData {
    revenue: { name: string; revenue: number; inquiries: number }[];
    status: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/api/analytics/dashboard');
            const resData = await response.json();
            if (resData.success) {
                setData(resData.data);
            }
        } catch (error) {
            console.error('Fetch analytics error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="admin-loading">Loading Analytics...</div>;
    if (!data) return <div className="admin-loading">No data available</div>;

    return (
        <div className="admin-analytics">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Analytics <span className="sub-text">분석 대시보드</span></h1>
                    <p className="admin-page-subtitle">Overview of sales and order trends.</p>
                </div>
                <button className="admin-button" onClick={fetchAnalytics}>↻ Refresh</button>
            </div>

            <div className="analytics-grid">
                {/* Revenue Chart */}
                <div className="admin-card chart-card">
                    <h3>Monthly Revenue (Est.)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.revenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₩${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" name="Revenue (KRW)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="admin-card chart-card">
                    <h3>Order Status Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.status}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inquiry Trend */}
                <div className="admin-card chart-card full-width">
                    <h3>Inquiry Volume Trend</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.revenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="inquiries" fill="#82ca9d" name="Inquiries Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
