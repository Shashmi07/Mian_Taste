import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { adminAuthAPI } from '../services/api';
import { adminLoginSchema } from '../utils/validation';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    console.log('Login form submitted with:', values);
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login...');
      const response = await adminAuthAPI.login(values.username, values.password);
      console.log('Login response:', response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data);
      
      // Redirect to chef dashboard after successful login
      console.log('Redirecting to chef dashboard...');
      navigate('/chef-dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 bg-red-600">
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
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={adminLoginSchema}
          onSubmit={handleLogin}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#dc2626' }}
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#dc2626' }}
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white p-3 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                style={{ backgroundColor: loading ? '#9ca3af' : '#dc2626' }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#dc2626';
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Note:</strong><br />
          Use your chef credentials from the admin dashboard
        </div>
      </div>
    </div>
  );
}