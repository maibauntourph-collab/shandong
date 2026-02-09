import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Customer {
    email: string;
    name: string;
    phone: string;
    totalInquiries: number;
    lastInquiry: string;
    hasConfirmed: boolean;
}

const AdminCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    const fetchCustomers = async () => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '20',
                search,
            });
            const response = await api.get(`/api/admin/customers?${params}`);
            const data = await response.json();

            if (data.success) {
                setCustomers(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchCustomers();
    };

    return (
        <div className="admin-customers">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Customers <span className="sub-text">고객 관리</span></h1>
                    <p className="admin-page-subtitle">List of customers who have submitted inquiries.</p>
                </div>
            </div>

            {/* Search */}
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by name, email, phone... (이름, 이메일, 전화번호)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="admin-button">Search</button>
            </form>

            {/* Customer List */}
            <div className="admin-card">
                {isLoading ? (
                    <div className="admin-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="empty-state">
                        <p>No customers found.</p>
                    </div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Inquiries</th>
                                    <th>Recent</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.email}>
                                        <td>
                                            <div className="customer-name">
                                                <span className="avatar">{customer.name.charAt(0)}</span>
                                                {customer.name}
                                            </div>
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <span className="inquiry-count">{customer.totalInquiries}</span>
                                        </td>
                                        <td>{formatDate(customer.lastInquiry)}</td>
                                        <td>
                                            {customer.hasConfirmed ? (
                                                <span className="status-badge confirmed">Confirmed</span>
                                            ) : (
                                                <span className="status-badge pending">Inquiry</span>
                                            )}
                                        </td>
                                        <td>
                                            <a href={`/admin/inquiries?search=${customer.email}`} className="text-blue-500 hover:underline">
                                                View Orders
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    &lt; Prev
                                </button>
                                <span className="page-info">{page} / {totalPages}</span>
                                <button
                                    className="page-btn"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next &gt;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
