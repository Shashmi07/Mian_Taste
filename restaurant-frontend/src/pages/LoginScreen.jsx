import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { customerAPI } from "../services/api";
import noodles3 from "../assets/MenuItems/beefRamen.jpg";
import noodles1 from "../assets/MenuItems/chickenRamen.jpg";
import noodles from "../assets/ramen.jpg";
import logo from "../assets/logo.jpeg";

const LoginScreen = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Remove pre-filled demo credentials
  const [password, setPassword] = useState(""); // Remove pre-filled demo credentials
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await customerAPI.login(email, password);
      
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
      
      // Dispatch custom event to notify NavBar and other components
      window.dispatchEvent(new CustomEvent('authChange'));
      
      if (onLogin) {
        onLogin(response.data);
      }
      
      // Check if user should return to a specific page after login
      const returnAfterLogin = localStorage.getItem('returnAfterLogin');
      if (returnAfterLogin) {
        navigate(returnAfterLogin);
      } else {
        navigate('/'); // Default redirect to homepage
      }
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

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 pr-10 lg:pr-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                required
              />
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
              <button className="text-green-600 hover:text-green-700 transition-colors">
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
          </form>

          {/* Divider */}
          <div className="my-4 lg:my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
            <button className="flex items-center justify-center px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-1 lg:ml-2 text-xs lg:text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-1 lg:ml-2 text-xs lg:text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

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
  );
};

export default LoginScreen;