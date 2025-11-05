import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const socketUrl = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
    console.log('Connecting to WebSocket:', socketUrl);
    const newSocket = io(socketUrl);
    
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('join', userId);
    });

    newSocket.on('newSwapRequest', (data) => {
      console.log('New swap request received:', data);
      setNotifications(prev => [...prev, {
        type: 'newRequest',
        message: data.message,
        data: data.request,
        timestamp: new Date()
      }]);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('New Swap Request', {
          body: data.message,
          icon: '/logo192.png'
        });
      }
    });

    newSocket.on('swapAccepted', (data) => {
      console.log('Swap accepted:', data);
      setNotifications(prev => [...prev, {
        type: 'accepted',
        message: data.message,
        data: data.request,
        timestamp: new Date()
      }]);
      
      if (Notification.permission === 'granted') {
        new Notification('Swap Accepted!', {
          body: data.message,
          icon: '/logo192.png'
        });
      }
    });

    newSocket.on('swapRejected', (data) => {
      console.log('Swap rejected:', data);
      setNotifications(prev => [...prev, {
        type: 'rejected',
        message: data.message,
        data: data.request,
        timestamp: new Date()
      }]);
      
      if (Notification.permission === 'granted') {
        new Notification('Swap Rejected', {
          body: data.message,
          icon: '/logo192.png'
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      notifications, 
      clearNotifications,
      removeNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
};
