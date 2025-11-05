import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Requests({ token }) {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        axios.get('/api/swap-requests/incoming', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/swap-requests/outgoing', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setIncomingRequests(incomingRes.data);
      setOutgoingRequests(outgoingRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accept) => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      await axios.post(`/api/swap-response/${requestId}`, { accept }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(accept ? 'Swap accepted successfully!' : 'Swap rejected');
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process response');
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
        <h1>Swap Requests</h1>
        <p>Manage incoming and outgoing swap requests</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Incoming Requests</h2>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📬</div>
            <h3>No incoming requests</h3>
            <p>You'll see swap requests from other users here</p>
          </div>
        ) : (
          <div className="event-list">
            {incomingRequests.map(request => (
              <div key={request._id} className="event-item">
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: '#667eea' }}>
                    {request.requesterId?.name}
                  </strong> wants to swap:
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Their Slot:</div>
                    <div>{request.requesterSlotId?.title}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {formatDateTime(request.requesterSlotId?.startTime)}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '24px' }}>⇄</div>
                  
                  <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Your Slot:</div>
                    <div>{request.targetSlotId?.title}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {formatDateTime(request.targetSlotId?.startTime)}
                    </div>
                  </div>
                </div>
                
                <div className="event-actions">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleResponse(request._id, true)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Accept'}
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleResponse(request._id, false)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <div className="card-header">
          <h2>Outgoing Requests</h2>
        </div>

        {outgoingRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📤</div>
            <h3>No outgoing requests</h3>
            <p>Your swap requests will appear here</p>
          </div>
        ) : (
          <div className="event-list">
            {outgoingRequests.map(request => (
              <div key={request._id} className="event-item">
                <div style={{ marginBottom: '16px' }}>
                  Waiting for <strong style={{ color: '#667eea' }}>
                    {request.targetUserId?.name}
                  </strong> to respond:
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Your Slot:</div>
                    <div>{request.requesterSlotId?.title}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {formatDateTime(request.requesterSlotId?.startTime)}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '24px' }}>⇄</div>
                  
                  <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Their Slot:</div>
                    <div>{request.targetSlotId?.title}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {formatDateTime(request.targetSlotId?.startTime)}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '12px', color: '#f57c00', fontWeight: '600' }}>
                  ⏳ Pending...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;
