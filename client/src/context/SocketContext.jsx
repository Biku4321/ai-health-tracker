import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user && !socket) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
      
      console.log("🔌 Connecting to Socket:", SOCKET_URL);

      const newSocket = io(SOCKET_URL, {
        auth: { token: user.token }, 
        transports: ['polling', 'websocket'],
        withCredentials: true, 
        reconnectionAttempts: 5,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log("✅ Socket Connected:", newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log("❌ Socket Disconnected");
        setIsConnected(false);
      });

      newSocket.on('connect_error', (err) => {
        console.error("❌ Socket Connection Error:", err.message);
        setIsConnected(false);
      });

      newSocket.on('notification', (data) => {
        Toastify({
          text: data.message,
          duration: 4000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #1A3C40, #4EC5C1)",
            borderRadius: "12px",
          }
        }).showToast();
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);