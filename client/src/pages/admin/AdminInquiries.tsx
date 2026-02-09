import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AdminInquiries.css';
import { api } from '../../lib/api';
import { Inquiry, EventLogistics } from '@shared/types';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(searchParam);

    // Logistics state
    const [logisticsForm, setLogisticsForm] = useState<EventLogistics>({
        staffAssigned: [],
        vehicle: '',
        equipment: []
    });

    useEffect(() => {
        setSearchTerm(searchParam);
    }, [searchParam]);

    useEffect(() => {
        fetchInquiries();
    }, [filterStatus, page, searchTerm]);

    useEffect(() => {
        if (selectedInquiry) {
            setLogisticsForm({
                staffAssigned: selectedInquiry.eventLogistics?.staffAssigned || [],
                vehicle: selectedInquiry.eventLogistics?.vehicle || '',
                equipment: selectedInquiry.eventLogistics?.equipment || []
            });
        }
    }, [selectedInquiry]);

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                status: filterStatus === 'all' ? '' : filterStatus,
                page: String(page),
                limit: '20',
                search: searchTerm
            });
            const response = await api.get(`/api/inquiries?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setInquiries(data.data);
                setTotalPages(data.pagination.totalPages);
            } else {
                setInquiries([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus?: string, newNotes?: string) => {
        try {
            const body: any = {};
            if (newStatus) body.status = newStatus;
            if (newNotes !== undefined) body.notes = newNotes;

            await api.patch(`/api/inquiries/${id}`, body);
            fetchInquiries();
            if (selectedInquiry?._id === id) {
                setSelectedInquiry(prev => prev ? ({ ...prev, ...(newStatus && { status: newStatus }), ...(newNotes && { notes: newNotes }) }) : null);
            }
            if (newNotes !== undefined) alert('Note saved!');
        } catch (error) {
            alert('Update failed');
        }
    };

    const saveLogistics = async () => {
        if (!selectedInquiry) return;
        try {
            await api.patch(`/api/inquiries/${selectedInquiry._id}`, {
                eventLogistics: logisticsForm
            });
            alert('Logistics saved!');
            fetchInquiries();
            setSelectedInquiry(prev => prev ? ({ ...prev, eventLogistics: logisticsForm }) : null);
        } catch (error) {
            alert('Failed to save logistics');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    return (
        <div className="admin-inquiries">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Orders / Catering <span className="sub-text">예약 관리</span></h1>
                    <p className="admin-page-subtitle">Manage catering orders and event logistics.</p>
                </div>
                <button className="admin-button" onClick={fetchInquiries}>↻ Refresh</button>
            </div>

            <div className="inquiry-filters">
                {[{ id: 'all', label: 'All' }, { id: 'pending', label: 'Pending' }, { id: 'confirmed', label: 'Confirmed' }, { id: 'completed', label: 'Completed' }]
                    .map(s => (
                        <button key={s.id} className={`filter-btn ${filterStatus === s.id ? 'active' : ''}`} onClick={() => { setFilterStatus(s.id); setPage(1); }}>
                            {s.label}
                        </button>
                    ))}
            </div>

            <div className="inquiry-layout">
                <div className="admin-card inquiry-list">
                    {isLoading ? <div className="admin-loading">Loading...</div> : (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr><th>Name</th><th>Date</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {inquiries.map(inq => (
                                        <tr key={inq._id} className={selectedInquiry?._id === inq._id ? 'selected' : ''} onClick={() => setSelectedInquiry(inq)}>
                                            <td>{inq.name}</td>
                                            <td>{formatDate(inq.eventDate)}</td>
                                            <td><span className={`status-badge ${inq.status}`}>{inq.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&lt;</button>
                                    <span style={{ margin: '0 10px' }}>{page} / {totalPages}</span>
                                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>&gt;</button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {selectedInquiry ? (
                    <div className="admin-card inquiry-detail">
                        <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Order Details</h3>
                            <button className="close-btn" onClick={() => setSelectedInquiry(null)}>✕</button>
                        </div>

                        <div className="detail-grid">
                            <div className="detail-item"><label>Name</label><p>{selectedInquiry.name}</p></div>
                            <div className="detail-item"><label>Email</label><p>{selectedInquiry.email}</p></div>
                            <div className="detail-item"><label>Phone</label><p>{selectedInquiry.phone}</p></div>
                            <div className="detail-item"><label>Date</label><p>{formatDate(selectedInquiry.eventDate)}</p></div>
                            <div className="detail-item"><label>Guests</label><p>{selectedInquiry.guestCount}</p></div>
                            <div className="detail-item"><label>Budget</label><p>{selectedInquiry.budget || 'N/A'}</p></div>
                            <div className="detail-item full"><label>Message</label><p>{selectedInquiry.message}</p></div>

                            {/* Internal Notes */}
                            <div className="detail-item full" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Internal Notes
                                    <button className="admin-button sm" onClick={() => {
                                        const val = (document.getElementById(`note-${selectedInquiry._id}`) as HTMLTextAreaElement).value;
                                        updateStatus(selectedInquiry._id, undefined, val);
                                    }}>Save Note</button>
                                </label>
                                <textarea id={`note-${selectedInquiry._id}`} defaultValue={selectedInquiry.notes} className="admin-textarea" />
                            </div>

                            {/* Logistics Section */}
                            <div className="detail-item full" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>Event Logistics (배차/인력)</strong>
                                    <button className="admin-button sm" onClick={saveLogistics}>Save Logistics</button>
                                </label>
                                <div className="logistics-form" style={{ display: 'grid', gap: '10px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.9rem', color: '#666' }}>Staff Assigned (comma separated)</label>
                                        <input
                                            className="admin-input"
                                            value={logisticsForm.staffAssigned.join(', ')}
                                            onChange={e => setLogisticsForm({ ...logisticsForm, staffAssigned: e.target.value.split(',').map(s => s.trim()) })}
                                            placeholder="John, Jane..."
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.9rem', color: '#666' }}>Vehicle</label>
                                        <input
                                            className="admin-input"
                                            value={logisticsForm.vehicle}
                                            onChange={e => setLogisticsForm({ ...logisticsForm, vehicle: e.target.value })}
                                            placeholder="Truck 1..."
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.9rem', color: '#666' }}>Equipment (comma separated)</label>
                                        <input
                                            className="admin-input"
                                            value={logisticsForm.equipment.join(', ')}
                                            onChange={e => setLogisticsForm({ ...logisticsForm, equipment: e.target.value.split(',').map(s => s.trim()) })}
                                            placeholder="Tables, Chairs..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="status-actions" style={{ marginTop: '2rem' }}>
                            <label>Update Status</label>
                            <div className="status-buttons">
                                {['pending', 'confirmed', 'completed'].map(s => (
                                    <button key={s} className={`status-btn ${s} ${selectedInquiry.status === s ? 'active' : ''}`} onClick={() => updateStatus(selectedInquiry._id, s)}>
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="admin-card inquiry-detail empty-selection">Select an order</div>
                )}
            </div>
        </div>
    );
};

export default AdminInquiries;
