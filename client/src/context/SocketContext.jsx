import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && !socket) {
      const SOCKET_URL = "https://ai-health-tracker-56st.onrender.com";

      console.log("🔌 Connecting to:", SOCKET_URL);

      const newSocket = io(SOCKET_URL, {
        auth: { token: user.token },
        // [CRITICAL] FORCE polling. This prevents the 'wss://' error completely.
        transports: ["polling"],
        withCredentials: false
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected via Polling:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        // Log the exact cause
        console.error("❌ Connection Error:", err.message);
        // Look at the Network tab in DevTools for the real response!
      });

      newSocket.on("notification", (data) => {
        Toastify({
          text: data.message,
          duration: 4000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #1A3C40, #4EC5C1)",
            borderRadius: "12px",
          },
        }).showToast();
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
