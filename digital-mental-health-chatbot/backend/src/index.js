const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const chatRoutes = require('./routes/chatRoutes');
const moodRoutes = require('./routes/moodRoutes');
const forumRoutes = require('./routes/forumRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import database connection
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Mental Health Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/forum', forumRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send-message', (data) => {
    io.to(data.chatId).emit('receive-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Crisis detection endpoint
app.post('/api/crisis-detection', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // Simple crisis keyword detection (expand with ML model)
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'harm myself'];
    const isCrisis = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isCrisis) {
      // Log crisis event
      console.log(`CRISIS DETECTED for user ${userId}: ${message}`);
      
      // Here you would:
      // 1. Save to crisis log
      // 2. Alert mental health professionals
      // 3. Send immediate resources
      
      res.json({
        crisis: true,
        message: "I'm very sorry to hear that you're going through this. Please seek help immediately.",
        resources: {
          helpline: "9152987821",
          emergency: "108",
          message: "Your life is valuable. Please contact professional help."
        }
      });
    } else {
      res.json({ crisis: false });
    }
  } catch (error) {
    console.error('Crisis detection error:', error);
    res.status(500).json({ error: 'Crisis detection service unavailable' });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Mental Health Platform API Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;