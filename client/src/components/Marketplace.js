import React, { useState, useEffect } from 'react';
import api from '../config/api';

function Marketplace({ token }) {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, myEventsRes] = await Promise.all([
        api.get('/api/swappable-slots', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setSwappableSlots(slotsRes.data);
      setMySwappableSlots(myEventsRes.data.filter(e => e.status === 'SWAPPABLE'));
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    if (mySwappableSlots.length === 0) {
      alert('You need to have at least one swappable slot to request a swap');
      return;
    }
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleConfirmSwap = async (mySlotId) => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      await api.post('/api/swap-request', {
        mySlotId,
        theirSlotId: selectedSlot._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Swap request sent successfully!');
      setShowModal(false);
      setSelectedSlot(null);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send swap request');
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
        <h1>Marketplace</h1>
        <p>Browse and request swaps for available time slots</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Available Slots</h2>
        </div>

        {swappableSlots.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No slots available</h3>
            <p>Check back later for swappable slots from other users</p>
          </div>
        ) : (
          <div className="event-list">
            {swappableSlots.map(slot => (
              <div key={slot._id} className="event-item">
                <div className="event-header">
                  <div>
                    <div className="event-title">{slot.title}</div>
                    <div className="event-time">
                      {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                    </div>
                    <div style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
                      👤 {slot.userId?.name || 'Unknown User'}
                    </div>
                  </div>
                </div>
                
                <div className="event-actions">
                  <button 
                    className="btn btn-info"
                    onClick={() => handleRequestSwap(slot)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Request Swap'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Your Slot to Offer</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Choose one of your swappable slots to offer in exchange
            </p>

            {mySwappableSlots.length === 0 ? (
              <p>You don't have any swappable slots</p>
            ) : (
              <div className="event-list">
                {mySwappableSlots.map(slot => (
                  <div key={slot._id} className="event-item" style={{ cursor: 'pointer' }}
                    onClick={() => handleConfirmSwap(slot._id)}>
                    <div className="event-title">{slot.title}</div>
                    <div className="event-time">
                      {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
