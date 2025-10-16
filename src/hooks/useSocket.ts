import { useState, useEffect } from 'react';
import socketService from '../services/socket';
import { SocketUserPresence } from '../types';

export const useSocket = () => {
  const [activeUsers, setActiveUsers] = useState<SocketUserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Set up socket event handlers
    socketService.setOnUserJoined((user) => {
      setActiveUsers(prev => {
        const exists = prev.some(u => u.userId === user.userId);
        if (!exists) {
          return [...prev, user];
        }
        return prev;
      });
    });

    socketService.setOnUserLeft((user) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== user.userId));
    });

    socketService.setOnActiveUsers((users) => {
      setActiveUsers(users);
    });

    // Check connection status
    const checkConnection = () => {
      setIsConnected(socketService.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    activeUsers,
    isConnected,
  };
};

