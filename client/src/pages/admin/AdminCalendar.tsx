import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { api } from '../../lib/api';
import 'react-calendar/dist/Calendar.css';
import './AdminCalendar.css';

interface Inquiry {
    _id: string;
    name: string;
    eventDate: string;
    guestCount: number;
    eventType: string;
    status: string;
}

const AdminCalendar = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedEvents, setSelectedEvents] = useState<Inquiry[]>([]);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            // Fetch all inquiries to map on calendar
            // Ideally we'd filter by date range, but for now fetch all non-rejected
            const response = await api.get('/api/inquiries?limit=1000');
            const data = await response.json();
            if (data.success) {
                // Filter only confirmed or completed events for the calendar (optional: show all)
                const validEvents = data.data.filter((i: Inquiry) =>
                    ['confirmed', 'completed', 'pending', 'contacted'].includes(i.status)
                );
                setInquiries(validEvents);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        }
    };

    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            const dayEvents = inquiries.filter(i => i.eventDate.startsWith(dateStr));

            if (dayEvents.length > 0) {
                return (
                    <div className="calendar-badges">
                        {dayEvents.map(ev => (
                            <div key={ev._id} className={`calendar-dot status-${ev.status}`} title={`${ev.name} - ${ev.eventType}`} />
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    const handleDateClick = (value: any) => {
        const date = value as Date;
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        const dayEvents = inquiries.filter(i => i.eventDate.startsWith(dateStr));
        setSelectedEvents(dayEvents);
    };

    return (
        <div className="admin-calendar-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Calendar <span className="sub-text">일정 관리</span></h1>
                    <p className="admin-page-subtitle">View and manage booking schedule.</p>
                </div>
            </div>

            <div className="calendar-layout">
                <div className="admin-card calendar-container">
                    <Calendar
                        onChange={handleDateClick}
                        value={selectedDate}
                        tileContent={getTileContent}
                        calendarType="gregory"
                    />
                </div>

                <div className="admin-card event-list">
                    <h3>Events for {selectedDate.toLocaleDateString()}</h3>
                    {selectedEvents.length === 0 ? (
                        <p className="text-muted">No events scheduled efficiently.</p>
                    ) : (
                        <div className="events-grid">
                            {selectedEvents.map(event => (
                                <div key={event._id} className={`event-card status-${event.status}`}>
                                    <div className="event-header">
                                        <h4>{event.name}</h4>
                                        <span className={`status-badge ${event.status}`}>{event.status}</span>
                                    </div>
                                    <p><strong>Type:</strong> {event.eventType}</p>
                                    <p><strong>Guests:</strong> {event.guestCount}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCalendar;
