const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Add socket to requests BEFORE routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import routes - FIXED: Use correct file names
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders'); // Changed from orderRoutes to orders
const inventoryRoutes = require('./routes/inventory');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Socket handlers - Check if this file exists
try {
  require('./socket/socketHandlers')(io);
} catch (error) {
  console.log('Socket handlers not found, creating basic socket setup');
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-kitchen', () => {
      socket.join('kitchen');
      console.log('User joined kitchen room');
    });
    
    socket.on('join-order-tracking', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log('User joined order tracking:', orderId);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Mian Taste API is running!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
});