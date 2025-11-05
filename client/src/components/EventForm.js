import React, { useState } from 'react';

function EventForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    status: 'BUSY'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Create New Event</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Team Meeting"
            />
          </div>
          
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="BUSY">Busy</option>
              <option value="SWAPPABLE">Swappable</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
