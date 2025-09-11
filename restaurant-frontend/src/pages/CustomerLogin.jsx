import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customerAPI } from "../services/api";
import { loginSchema } from '../utils/validation';
import noodles3 from "../assets/MenuItems/beefRamen.jpg";
import noodles1 from "../assets/MenuItems/chickenRamen.jpg";
import noodles from "../assets/ramen.jpg";
import logo from "../assets/logo.jpeg";

const LoginScreen = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await customerAPI.login(values.email, values.password);
      
      // Save customer authentication data
      localStorage.setItem('customerToken', response.data.data.token);
      localStorage.setItem('customerUser', JSON.stringify(response.data.data.user));
      
      // Fetch complete customer profile from database
      try {
        const profileResponse = await customerAPI.getProfile();
        if (profileResponse.data && profileResponse.data.success) {
          // Update localStorage with complete profile data
          const completeUserData = {
            ...response.data.data.user,
            ...profileResponse.data.data.user
          };
          localStorage.setItem('customerUser', JSON.stringify(completeUserData));
          console.log('✅ Customer profile fetched and updated:', completeUserData);
        }
      } catch (profileError) {
        console.warn('Could not fetch customer profile, using login data:', profileError);
        // Continue with basic login data if profile fetch fails
      }
      
      // Check if user should return to a specific page after login FIRST
      const returnAfterLogin = localStorage.getItem('returnAfterLogin');
      console.log('Login success - checking returnAfterLogin:', returnAfterLogin);
      
      // Dispatch custom event to notify NavBar and other components
      window.dispatchEvent(new CustomEvent('authChange'));
      
      if (onLogin) {
        onLogin(response.data);
      }
      
      // Navigate after authentication state is set
      setTimeout(() => {
        if (returnAfterLogin) {
          console.log('Found returnAfterLogin, navigating to:', returnAfterLogin);
          localStorage.removeItem('returnAfterLogin'); // Clear the return path
          navigate(returnAfterLogin);
        } else {
          console.log('No returnAfterLogin found, going to homepage');
          navigate('/'); // Default redirect to homepage
        }
      }, 100); // Small delay to ensure auth state is updated
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };  return (
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
              Authentic Asian
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500">
                Cuisine Awaits
              </span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              Discover the perfect blend of traditional flavors and modern culinary artistry. 
              Every dish tells a story of heritage and passion.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom/Right side - Login form */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white border-opacity-20 p-6 sm:p-8 lg:p-10 w-full max-w-md mx-auto">
          {/* Logo and title */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-block p-3 lg:p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg mb-4">
              <img src={logo} alt="logo" className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-full" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Grand Minato</h1>
            <p className="text-gray-600 text-sm lg:text-base">Welcome back to your culinary journey</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
              {error}
            </div>
          )}

          {/* Login form with Formik validation */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4 lg:space-y-6">
                <div className="relative">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 pr-10 lg:pr-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1 ml-2" />
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:border-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    className="text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </button>
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 lg:mt-10">
            {/* Signup link */}
            <p className="text-center text-gray-600 text-sm lg:text-base">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors underline"
              onClick={() => navigate("/signup")}
            >
              Sign up now
            </button>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;