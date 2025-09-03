import axios from 'axios';

// Dynamic API base URL - works for both localhost and IP addresses
const getAPIBaseURL = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : `http://${hostname}:5000/api`;
};

const API_BASE_URL = getAPIBaseURL();

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Update axios base URL dynamically (in case hostname changes)
export const updateAPIBaseURL = () => {
  axios.defaults.baseURL = getAPIBaseURL();
};

// Chef authAPI export
export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password })
};

// Admin authAPI export
export const adminAuthAPI = {
  login: (email, password) => axios.post('/admin-auth/login', { email, password }),
  getProfile: () => {
    const token = localStorage.getItem('token');
    return axios.get('/admin-auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
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
  }),
  
  // Public order creation (no auth required)
  createOrder: (orderData) => axios.post('/orders/public', orderData),
  
  // Track order (no auth required)
  trackOrder: (orderId) => axios.get(`/orders/track/${orderId}`)
};

export const preOrderAPI = {
  // Create preorder (no auth required)
  createPreOrder: (preOrderData) => axios.post('/pre-orders', preOrderData),
  
  // Get preorders (auth required - admin only)
  getPreOrders: () => axios.get('/pre-orders', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  // Update preorder status (auth required - admin only)
  updateStatus: (preOrderId, status) => axios.put(`/pre-orders/${preOrderId}/status`, { status }, {
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

export const menuAPI = {
  getAllMenuItems: () => axios.get('/menu'),
  
  getMenuItemsByCategory: (category) => axios.get(`/menu/category/${category}`),
  
  createMenuItem: (itemData) => axios.post('/menu', itemData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  updateMenuItem: (itemId, itemData) => axios.put(`/menu/${itemId}`, itemData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  deleteMenuItem: (itemId) => axios.delete(`/menu/${itemId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
};