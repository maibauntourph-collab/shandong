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
                <h1 className="admin-page-title">고객 관리</h1>
                <p className="admin-page-subtitle">문의 이력이 있는 고객 목록입니다</p>
            </div>

            {/* Search */}
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="이름, 이메일, 연락처 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="btn btn-primary">검색</button>
            </form>

            {/* Customer List */}
            <div className="admin-card">
                {isLoading ? (
                    <div className="loading">로딩 중...</div>
                ) : customers.length === 0 ? (
                    <div className="empty-state">
                        <p>등록된 고객이 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>고객명</th>
                                    <th>이메일</th>
                                    <th>연락처</th>
                                    <th>총 문의</th>
                                    <th>최근 문의</th>
                                    <th>상태</th>
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
                                            <span className="inquiry-count">{customer.totalInquiries}건</span>
                                        </td>
                                        <td>{formatDate(customer.lastInquiry)}</td>
                                        <td>
                                            {customer.hasConfirmed ? (
                                                <span className="status-badge confirmed">예약확정</span>
                                            ) : (
                                                <span className="status-badge pending">문의중</span>
                                            )}
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
                                    ← 이전
                                </button>
                                <span className="page-info">{page} / {totalPages}</span>
                                <button
                                    className="page-btn"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    다음 →
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
