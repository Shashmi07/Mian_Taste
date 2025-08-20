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

// Initialize Express
const app = express();

// Middleware
app.use(cors());
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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to both databases
connectDB(); // Chef dashboard database
connectCustomerDB(); // Customer dashboard database

// Routes - Fix the import names to match your actual file names
const authRoutes = require('./routes/auth'); // Changed from authRoutes
const orderRoutes = require('./routes/orders'); // Changed from orderRoutes  
const inventoryRoutes = require('./routes/inventory'); // Changed from inventoryRoutes
const tableReservationRoutes = require('./routes/tableReservationRoutes');
const customerRoutes = require('./routes/customerRoutes'); // Customer registration and authentication

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/table-reservations', tableReservationRoutes); // Uses customer database
app.use('/api/customers', customerRoutes); // Customer authentication and profile management

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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});