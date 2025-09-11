import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customerAPI } from "../services/api";
import { resetPasswordSchema } from '../utils/validation';
import noodles3 from "../assets/MenuItems/beefRamen.jpg";
import noodles1 from "../assets/MenuItems/chickenRamen.jpg";
import noodles from "../assets/ramen.jpg";
import logo from "../assets/logo.jpeg";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    setToken(resetToken);
  }, [searchParams]);

  const handleSubmit = async (values) => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await customerAPI.resetPassword(token, values.newPassword);
      
      if (response.data && response.data.success) {
        // Save customer authentication data from reset response
        if (response.data.data && response.data.data.token) {
          localStorage.setItem('customerToken', response.data.data.token);
          localStorage.setItem('customerUser', JSON.stringify(response.data.data.user));
          
          // Dispatch custom event to notify NavBar and other components
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        
        setSuccess(true);
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Failed to reset password. Please try again.');
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Background decorative elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{background: '#78D860'}}></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-20" style={{background: '#F4CF38'}}></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-full opacity-10"></div>

      {/* Top/Left side - Food showcase */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 min-h-[40vh] lg:min-h-screen">
        <div className="max-w-md">
          {/* Hero food images in artistic layout */}
          <div className="relative mb-6 lg:mb-8">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
              <img
                src={noodles3}
                alt="Delicious noodles"
                className="w-24 h-20 sm:w-32 sm:h-24 lg:w-40 lg:h-32 object-cover rounded-xl lg:rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
              />
              <img
                src={noodles1}
                alt="Steaming bowl"
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-xl lg:rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-2 lg:mt-4"
              />
            </div>
            <img
              src={noodles}
              alt="Traditional ramen"
              className="w-20 h-16 sm:w-24 sm:h-20 lg:w-32 lg:h-28 object-cover rounded-xl lg:rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-300 -mt-4 lg:-mt-8 ml-8 lg:ml-12"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-4 leading-tight">
              {success ? 'Welcome Back!' : 'Create New Password'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500">
                {success ? 'You\'re All Set' : 'Almost There'}
              </span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              {success 
                ? 'Your password has been successfully updated. You are now logged in!'
                : 'Please enter your new password. Make it strong and secure.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Bottom/Right side - Reset password form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white border-opacity-20 p-6 sm:p-8 lg:p-10 w-full max-w-md mx-auto">
          {/* Logo and title */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-block p-3 lg:p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg mb-4">
              <img src={logo} alt="logo" className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-full" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {success ? 'Success!' : 'New Password'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {success 
                ? 'Redirecting you to homepage...'
                : 'Enter your new password below'
              }
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Password reset successful!</p>
                  <p className="text-sm mt-1">You are now logged in. Redirecting to homepage...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
              {error}
              {error.includes('Invalid reset link') && (
                <div className="mt-3">
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm underline hover:text-red-800 transition-colors"
                  >
                    Request a new password reset
                  </button>
                </div>
              )}
            </div>
          )}

          {!success && token && (
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-4 lg:space-y-6">
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 pr-10 lg:pr-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 lg:pr-4 flex items-center text-gray-500 focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 pr-10 lg:pr-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 lg:pr-4 flex items-center text-gray-500 focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                    )}
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 lg:py-4 px-4 lg:px-6 text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-lg transform hover:scale-105 disabled:transform-none transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 lg:h-5 lg:w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Update Password
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </button>
              </Form>
            </Formik>
          )}

          {!success && (
            <div className="mt-8 lg:mt-10">
              {/* Back to login link */}
              <p className="text-center text-gray-600 text-sm lg:text-base">
                Remember your password?{" "}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors underline"
                  onClick={() => navigate("/login")}
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;