import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Kitchen methods
  joinKitchen() {
    if (this.socket && this.connected) {
      this.socket.emit('join-kitchen');
      console.log('Joined kitchen room');
    }
  }

  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('order-updated', callback);
    }
  }

  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  // Order tracking methods
  joinOrderTracking(orderId) {
    if (this.socket && this.connected) {
      this.socket.emit('join-order-tracking', orderId);
    }
  }

  onOrderStatusChange(callback) {
    if (this.socket) {
      this.socket.on('order-status-changed', callback);
    }
  }

  // Clean up listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

const socketService = new SocketService();
export default socketService;