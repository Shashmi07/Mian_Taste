import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAuthAPI } from '../services/api';

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAuthAPI.login(credentials.email, credentials.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data);
      
      // Redirect to admin dashboard after successful login
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4" style={{ backgroundColor: '#46923c' }}>
            <Shield className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">Sign in to manage the restaurant</p>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#46923c' }}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#46923c' }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white p-3 rounded-lg font-medium transition duration-200 disabled:opacity-50"
            style={{ backgroundColor: loading ? '#9ca3af' : '#46923c' }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#5BC142';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#46923c';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Note:</strong><br />
          Use your admin credentials to access the dashboard
        </div>
      </div>
    </div>
  );
}