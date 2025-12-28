import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && !socket) {
      // FIX: Explicitly point to backend port 5000
      // If you use the proxy in vite.config.js, you can also use '/' 
      // but explicit URL is safer for debugging.
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const newSocket = io(SOCKET_URL, {
        auth: { token: user.token },
        transports: ['websocket', 'polling'], // Try websocket first
        withCredentials: true
      });

      setSocket(newSocket);

      newSocket.on('connect_error', (err) => {
        console.error("Socket Connection Error:", err);
      });

      // Global Notification Listener
      newSocket.on('notification', (data) => {
        Toastify({
          text: data.message,
          duration: 4000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #1A3C40, #4EC5C1)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }
        }).showToast();
      });

      return () => newSocket.disconnect();
    }
  }, [user, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);