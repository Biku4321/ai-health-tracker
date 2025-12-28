const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Import HTTP
const { Server } = require('socket.io'); // Import Socket.io
const connectDB = require('./src/config/db');
const { streamGeminiResponse } = require('./src/services/ai-engine/geminiService');
const { errorHandler } = require('./src/middleware/errorMiddleware');
// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app); // Wrap Express

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"]
  }
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle AI Chat Stream
  socket.on('chat_message', async (data) => {
    const { message, userId } = data;
    try {
      // Call the streaming service
      await streamGeminiResponse(userId, message, socket);
    } catch (error) {
      socket.emit('error', { message: 'AI failed to respond' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/logs', require('./src/routes/logRoutes'));
app.use('/api/integrations', require('./src/routes/integrationRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/journals', require('./src/routes/journalRoutes'));
app.use('/api/community', require('./src/routes/communityRoutes'));
// Default Route
app.get('/', (req, res) => {
  res.send('AI Health Tracker API is running...');
});

// Error Handling
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode ? res.statusCode : 500;
//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// });
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

// Listen on 'server' not 'app'
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));