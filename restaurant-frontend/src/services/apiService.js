/**
 * Unified API Service for Mian Taste Restaurant Management System
 * Provides centralized API communication with consistent error handling
 */

class APIService {
  constructor() {
    // Dynamic API base URL detection
    this.baseURL = this.getAPIBaseURL();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Determine the appropriate API base URL based on environment
   */
  getAPIBaseURL() {
    // Production - use environment variable
    if (process.env.REACT_APP_API_URL) {
      return `${process.env.REACT_APP_API_URL}/api`;
    }
    
    // Local development
    return 'http://localhost:5000/api';
  }

  /**
   * Get authentication headers based on user type
   */
  getAuthHeaders(userType = 'customer') {
    const tokenKey = userType === 'customer' ? 'customerToken' : 'token';
    const token = localStorage.getItem(tokenKey);
    
    return token ? {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    } : this.defaultHeaders;
  }

  /**
   * Generic request method with error handling
   */
  async request(method, endpoint, data = null, options = {}) {
    const { userType = 'customer', ...requestOptions } = options;
    
    try {
      const config = {
        method: method.toUpperCase(),
        headers: this.getAuthHeaders(userType),
        ...requestOptions
      };

      if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return responseData;
    } catch (error) {
      console.error(`API Request failed (${method.toUpperCase()} ${endpoint}):`, error);
      throw error;
    }
  }

  // ============ AUTHENTICATION SERVICES ============

  /**
   * Customer Authentication
   */
  async customerLogin(credentials) {
    return await this.request('POST', '/customers/login', credentials);
  }

  async customerRegister(userData) {
    return await this.request('POST', '/customers/register', userData);
  }

  /**
   * Admin Authentication
   */
  async adminLogin(credentials) {
    return await this.request('POST', '/admin-auth/login', credentials, { userType: 'admin' });
  }

  /**
   * Chef Authentication
   */
  async chefLogin(credentials) {
    return await this.request('POST', '/auth/login', credentials, { userType: 'chef' });
  }

  // ============ MENU SERVICES ============

  async getMenuItems() {
    return await this.request('GET', '/menu');
  }

  async getMenuItemsByCategory(category) {
    return await this.request('GET', `/menu/category/${category}`);
  }

  async createMenuItem(itemData) {
    return await this.request('POST', '/menu', itemData, { userType: 'admin' });
  }

  async updateMenuItem(id, itemData) {
    return await this.request('PUT', `/menu/${id}`, itemData, { userType: 'admin' });
  }

  async deleteMenuItem(id) {
    return await this.request('DELETE', `/menu/${id}`, null, { userType: 'admin' });
  }

  // ============ ORDER SERVICES ============

  async createOrder(orderData) {
    return await this.request('POST', '/orders/public', orderData);
  }

  async getOrders() {
    return await this.request('GET', '/orders', null, { userType: 'admin' });
  }

  async updateOrderStatus(orderId, status) {
    return await this.request('PATCH', `/orders/${orderId}/status`, { status }, { userType: 'chef' });
  }

  async trackOrder(orderId) {
    return await this.request('GET', `/orders/track/${orderId}`);
  }

  // ============ PRE-ORDER SERVICES ============

  async createPreOrder(preOrderData) {
    return await this.request('POST', '/pre-orders', preOrderData);
  }

  async getPreOrders() {
    return await this.request('GET', '/pre-orders', null, { userType: 'admin' });
  }

  async updatePreOrderStatus(preOrderId, status) {
    return await this.request('PATCH', `/pre-orders/${preOrderId}/status`, { status }, { userType: 'admin' });
  }

  // ============ QR ORDER SERVICES ============

  async createQROrder(qrOrderData) {
    return await this.request('POST', '/qr-orders', qrOrderData);
  }

  async getQROrders() {
    return await this.request('GET', '/qr-orders', null, { userType: 'admin' });
  }

  async updateQROrderStatus(qrOrderId, status) {
    return await this.request('PATCH', `/qr-orders/${qrOrderId}/status`, { status }, { userType: 'chef' });
  }

  // ============ TABLE RESERVATION SERVICES ============

  async createReservation(reservationData) {
    return await this.request('POST', '/table-reservations', reservationData);
  }

  async getReservations() {
    return await this.request('GET', '/table-reservations', null, { userType: 'admin' });
  }

  async updateReservationStatus(reservationId, status) {
    return await this.request('PATCH', `/table-reservations/${reservationId}/status`, { status }, { userType: 'admin' });
  }

  async checkTableAvailability(date, time, partySize) {
    return await this.request('GET', `/table-reservations/availability?date=${date}&time=${time}&partySize=${partySize}`);
  }

  // ============ FEEDBACK SERVICES ============

  async submitFeedback(feedbackData) {
    return await this.request('POST', '/feedback', feedbackData);
  }

  async getFeedback() {
    return await this.request('GET', '/admin-feedback', null, { userType: 'admin' });
  }

  // ============ INVENTORY SERVICES ============

  async getInventory() {
    return await this.request('GET', '/inventory', null, { userType: 'chef' });
  }

  async getAdminInventory() {
    return await this.request('GET', '/admin-inventory', null, { userType: 'admin' });
  }

  async updateInventoryItem(itemId, updateData) {
    return await this.request('PUT', `/inventory/${itemId}`, updateData, { userType: 'chef' });
  }

  // ============ USER MANAGEMENT SERVICES ============

  async getUsers() {
    return await this.request('GET', '/user-management/users', null, { userType: 'admin' });
  }

  async createUser(userData) {
    return await this.request('POST', '/user-management/users', userData, { userType: 'admin' });
  }

  async updateUser(userId, userData) {
    return await this.request('PUT', `/user-management/users/${userId}`, userData, { userType: 'admin' });
  }

  async deleteUser(userId) {
    return await this.request('DELETE', `/user-management/users/${userId}`, null, { userType: 'admin' });
  }

  // ============ ANALYTICS SERVICES ============

  async getAnalyticsData() {
    return await this.request('GET', '/admin-analytics/data', null, { userType: 'admin' });
  }

  // ============ UTILITY METHODS ============

  /**
   * Upload file (for menu item images, etc.)
   */
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders('admin'),
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  /**
   * Test email functionality
   */
  async testEmail(emailData) {
    return await this.request('POST', '/test-email', emailData, { userType: 'admin' });
  }
}

// Create and export singleton instance
const apiService = new APIService();
export default apiService;