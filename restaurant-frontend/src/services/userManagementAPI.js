import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const userManagementAPI = axios.create({
  baseURL: `${API_BASE_URL}/user-management`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
userManagementAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User Management API functions
export const userManagementService = {
  // Get all users (customers + staff)
  getAllUsers: async () => {
    try {
      const response = await userManagementAPI.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const response = await userManagementAPI.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users by role ${role}:`, error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await userManagementAPI.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Create new staff user
  createStaffUser: async (userData) => {
    try {
      const response = await userManagementAPI.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating staff user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData, userType = 'staff') => {
    try {
      const response = await userManagementAPI.put(`/users/${userId}?userType=${userType}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update staff user (alias for updateUser for backward compatibility)
  updateStaffUser: async (userId, userData) => {
    try {
      const response = await userManagementAPI.put(`/users/${userId}?userType=staff`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating staff user:', error);
      throw error;
    }
  },

  // Delete user (soft delete)
  deleteUser: async (userId, userType = 'staff') => {
    try {
      const response = await userManagementAPI.delete(`/users/${userId}?userType=${userType}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Toggle user active status
  toggleUserStatus: async (userId, userType = 'staff') => {
    try {
      const response = await userManagementAPI.patch(`/users/${userId}/toggle-status?userType=${userType}`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },
};

// Admin Authentication API
const adminAuthAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin-auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminAuthService = {
  // Admin login
  login: async (email, password) => {
    try {
      const response = await adminAuthAPI.post('/login', { email, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  },

  // Create first admin
  createFirstAdmin: async (adminData) => {
    try {
      const response = await adminAuthAPI.post('/create-first-admin', adminData);
      return response.data;
    } catch (error) {
      console.error('Error creating first admin:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  }
};

export default userManagementService;
