import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './EventForm';

function Dashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      await axios.post('/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchEvents();
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (eventId, newStatus) => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      await axios.put(`/api/events/${eventId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>My Calendar</h1>
        <p>Manage your schedule and mark slots as swappable</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>My Events</h2>
          <button className="btn btn-success" onClick={() => setShowForm(true)}>
            + Add Event
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No events yet</h3>
            <p>Create your first event to get started</p>
          </div>
        ) : (
          <div className="event-list">
            {events.map(event => (
              <div key={event._id} className="event-item">
                <div className="event-header">
                  <div>
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">
                      {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
                    </div>
                    <span className={`event-status status-${event.status.toLowerCase().replace('_', '-')}`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="event-actions">
                  {event.status === 'BUSY' && (
                    <button 
                      className="btn btn-info"
                      onClick={() => handleUpdateStatus(event._id, 'SWAPPABLE')}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Make Swappable'}
                    </button>
                  )}
                  {event.status === 'SWAPPABLE' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleUpdateStatus(event._id, 'BUSY')}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Mark as Busy'}
                    </button>
                  )}
                  {event.status !== 'SWAP_PENDING' && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteEvent(event._id)}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EventForm 
          onSubmit={handleCreateEvent}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
