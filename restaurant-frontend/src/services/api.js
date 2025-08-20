import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add authAPI export
export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password })
};

// Customer API for customer authentication and registration
export const customerAPI = {
  register: (userData) => axios.post('/customers/register', userData),
  login: (email, password) => axios.post('/customers/login', { email, password }),
  getProfile: () => {
    const token = localStorage.getItem('customerToken');
    return axios.get('/customers/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateProfile: (profileData) => {
    const token = localStorage.getItem('customerToken');
    return axios.put('/customers/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
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