// Simple API Configuration
const getAPIConfig = () => {
  // Production - use environment variable
  if (process.env.REACT_APP_API_URL) {
    // Socket.IO connects to the root server, not /api path
    // Remove /api from the end of the URL for socket connection
    const socketURL = process.env.REACT_APP_API_URL.replace(/\/api$/, '');

    return {
      baseURL: process.env.REACT_APP_API_URL,
      socketURL: socketURL
    };
  }

  // Local development - use current hostname (works for both localhost and network IP)
  const hostname = window.location.hostname;
  const baseURL = `http://${hostname}:5000`;

  return {
    baseURL: baseURL,
    socketURL: baseURL
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