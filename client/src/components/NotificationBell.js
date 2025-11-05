import React from 'react';
import { useSocket } from '../context/SocketContext';

function NotificationBell() {
  const { notifications, removeNotification } = useSocket();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const unreadCount = notifications.length;

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="clear-all"
                onClick={() => {
                  notifications.forEach((_, i) => removeNotification(i));
                  setShowDropdown(false);
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                No new notifications
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`notification-item notification-${notification.type}`}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <button 
                    className="remove-notification"
                    onClick={() => removeNotification(index)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
