// Simple API Configuration
const getAPIConfig = () => {
  // Production - use environment variable
  if (process.env.REACT_APP_API_URL) {
    return {
      baseURL: process.env.REACT_APP_API_URL,
      socketURL: process.env.REACT_APP_API_URL
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