import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ 
    email: 'maria@restaurant.com', 
    password: 'chef123' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(credentials.email, credentials.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-orange-500 p-3 rounded-full w-16 h-16 mx-auto mb-4">
            <ChefHat className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Chef Dashboard
          </h2>
          <p className="text-gray-600">Sign in to manage your kitchen</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white p-3 rounded-lg font-medium transition duration-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Demo Credentials:</strong><br />
          Email: maria@restaurant.com<br />
          Password: chef123
        </div>
      </div>
    </div>
  );
}