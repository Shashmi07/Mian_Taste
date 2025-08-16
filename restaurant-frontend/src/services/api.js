import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// Orders API
export const ordersAPI = {
  getOrders: (status) => api.get('/orders', { params: { status } }),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  acceptOrder: (id) => api.put(`/orders/${id}/accept`),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// Inventory API
export const inventoryAPI = {
  getInventory: () => api.get('/inventory'),
  createItem: (itemData) => api.post('/inventory', itemData),
  updateQuantity: (id, data) => api.put(`/inventory/${id}/quantity`, data),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
};

export default api;