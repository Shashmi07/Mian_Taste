// API Configuration for all environments
const getAPIConfig = () => {
  // Use environment variable for production deployment
  if (process.env.REACT_APP_API_URL) {
    return {
      baseURL: process.env.REACT_APP_API_URL,
      socketURL: process.env.REACT_APP_API_URL
    };
  }
  
  // For local development - dynamic detection
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost';
  
  return {
    baseURL: isLocalhost 
      ? 'http://localhost:5000' 
      : `http://${hostname}:5000`,
    socketURL: isLocalhost 
      ? 'http://localhost:5000' 
      : `http://${hostname}:5000`
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