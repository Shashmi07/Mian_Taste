import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add authAPI export
export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password })
};

export const ordersAPI = {
  getOrders: () => axios.get('/orders', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  acceptOrder: (orderId) => axios.put(`/orders/${orderId}/accept`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  updateOrderStatus: (orderId, data) => axios.put(`/orders/${orderId}/status`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
};

export const inventoryAPI = {
  getInventory: () => axios.get('/inventory', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  addItem: (itemData) => axios.post('/inventory', itemData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  updateQuantity: (itemId, data) => axios.put(`/inventory/${itemId}/quantity`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
};