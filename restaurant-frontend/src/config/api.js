// Simple API Configuration
const getAPIConfig = () => {
  // Production - use environment variable
  if (process.env.REACT_APP_API_URL) {
    return {
      baseURL: process.env.REACT_APP_API_URL,
      socketURL: process.env.REACT_APP_API_URL
    };
  }
  
  // Local development
  return {
    baseURL: 'http://localhost:5000',
    socketURL: 'http://localhost:5000'
  };
};

export const API_CONFIG = getAPIConfig();

// Helper function for full API URLs
export const getAPIUrl = (endpoint = '') => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function for socket URL
export const getSocketUrl = () => {
  return API_CONFIG.socketURL;
};

export default API_CONFIG;