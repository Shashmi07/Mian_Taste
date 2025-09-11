const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Database connections
const connectDB = require('./config/database'); // Chef database
const { connectCustomerDB } = require('./config/customerDatabase'); // Customer database
const { connectAdminDB } = require('./config/adminDatabase'); // Admin database

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:3001', 
    'http://10.11.5.232:3000', 
    'http://192.168.8.209:3000',
    process.env.FRONTEND_URL || 'https://mian-taste.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach socket.io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Create server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001", 
      "http://10.11.5.232:3000", 
      "http://192.168.8.209:3000",
      process.env.FRONTEND_URL || "https://mian-taste.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Connect to all databases
connectDB(); // Chef dashboard database
connectCustomerDB(); // Customer dashboard database
connectAdminDB(); // Admin dashboard database

// Routes - Fix the import names to match your actual file names
const authRoutes = require('./routes/auth'); // Changed from authRoutes
const orderRoutes = require('./routes/orders'); // Changed from orderRoutes  
const inventoryRoutes = require('./routes/inventory'); // Changed from inventoryRoutes
const tableReservationRoutes = require('./routes/tableReservations');
const customerRoutes = require('./routes/customers'); // Customer registration and authentication
const menuRoutes = require('./routes/menu'); // Menu management routes
const userManagementRoutes = require('./routes/userManagement'); // User management routes
const adminAuthRoutes = require('./routes/adminAuth'); // Admin authentication routes
const adminInventoryRoutes = require('./routes/adminInventory'); // Admin inventory routes (read-only)
const adminFeedbackRoutes = require('./routes/adminFeedback'); // Admin feedback routes
const qrOrderRoutes = require('./routes/qrOrders'); // QR order routes
const preOrderRoutes = require('./routes/preOrders'); // PreOrder routes
const feedbackRoutes = require('./routes/feedback'); // Feedback routes
const adminAnalyticsRoutes = require('./routes/adminAnalytics'); // Admin analytics routes

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/table-reservations', tableReservationRoutes); // Uses customer database
app.use('/api/customers', customerRoutes); // Customer authentication and profile management
app.use('/api/menu', menuRoutes); // Menu items API
app.use('/api/user-management', userManagementRoutes); // User management API
app.use('/api/admin-auth', adminAuthRoutes); // Admin authentication API
app.use('/api/admin-inventory', adminInventoryRoutes); // Admin inventory API (read-only)
app.use('/api/admin-feedback', adminFeedbackRoutes); // Admin feedback API 
app.use('/api/qr-orders', qrOrderRoutes); // QR order API
app.use('/api/pre-orders', preOrderRoutes); // PreOrder API
app.use('/api/feedback', feedbackRoutes); // Feedback API
app.use('/api/admin-analytics', adminAnalyticsRoutes); // Admin analytics API
app.use('/api/test-email', require('./routes/testEmail')); // Email testing routes

// Socket handlers
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mian Taste Backend Server running on port ${PORT} and accessible from all network interfaces`);
});