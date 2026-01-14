const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io');
const jwt = require("jsonwebtoken"); // [ADDED] Required for Auth Middleware
const connectDB = require("./src/config/db");
const {
  streamGeminiResponse,
} = require("./src/services/ai-engine/geminiService");
const { errorHandler } = require("./src/middleware/errorMiddleware");

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Express Middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL (Exact match, no slash at end)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Important for cookies/headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",         // Allow connection from any URL (Vercel/Localhost)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true    // Must be false if origin is "*"
  },
});

// 🔒 SOCKET AUTHENTICATION MIDDLEWARE
// This block runs BEFORE a user connects. It checks if they have a valid token.
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("❌ Socket Refused: No Token");
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user data to the socket session
    socket.user = decoded;
    
    console.log("✅ Socket Authorized for User:", decoded.id);
    next();
  } catch (err) {
    console.log("❌ Socket Auth Failed:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.io Logic (Runs only after Auth succeeds)
io.on("connection", (socket) => {
  console.log("🔌 User Connected:", socket.id);

  // Handle AI Chat Stream
  socket.on("chat_message", async (data) => {
    // We can now use socket.user.id instead of relying on client data if we wanted
    const { message, userId } = data; 
    
    console.log(`📩 Message from ${userId || socket.user.id}: ${message.substring(0, 20)}...`);

    try {
      await streamGeminiResponse(userId, message, socket);
    } catch (error) {
      console.error("Gemini Error:", error);
      socket.emit("error", { message: "AI failed to respond" });
    }
  });

  socket.on("disconnect", () => {
    console.log('👋 User Disconnected:', socket.id);
  });
});

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/logs", require("./src/routes/logRoutes"));
app.use("/api/integrations", require("./src/routes/integrationRoutes"));
app.use("/api/ai", require("./src/routes/aiRoutes"));
app.use("/api/journals", require("./src/routes/journalRoutes"));
app.use("/api/community", require("./src/routes/communityRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.send("AI Health Tracker API is running...");
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Listen on 'server'
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));