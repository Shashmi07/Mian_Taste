import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  socket = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen for order updates
  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('order-updated', callback);
    }
  }

  // Listen for new orders
  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  // Listen for inventory updates
  onInventoryUpdate(callback) {
    if (this.socket) {
      this.socket.on('inventory-updated', callback);
    }
  }
}

// Create and export the instance
const socketService = new SocketService();
export default socketService;