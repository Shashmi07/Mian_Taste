module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Kitchen staff joins kitchen room
    socket.on('join-kitchen', () => {
      socket.join('kitchen');
      console.log('User joined kitchen room:', socket.id);
    });
    
    // Customer joins order tracking
    socket.on('join-order-tracking', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log('User joined order tracking for order:', orderId);
    });
    
    // Leave order tracking
    socket.on('leave-order-tracking', (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log('User left order tracking for order:', orderId);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};