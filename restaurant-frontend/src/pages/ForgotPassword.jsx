import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customerAPI } from "../services/api";
import { forgotPasswordSchema } from '../utils/validation';
import noodles3 from "../assets/MenuItems/beefRamen.jpg";
import noodles1 from "../assets/MenuItems/chickenRamen.jpg";
import noodles from "../assets/ramen.jpg";
import logo from "../assets/logo.jpeg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await customerAPI.forgotPassword(values.email);
      
      if (response.data && response.data.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Failed to send reset email. Please try again.');
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
              Don't Worry
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500">
                We've Got You
              </span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              Forgot your password? No problem! Enter your email address and we'll send you a link to reset it.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom/Right side - Forgot password form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white border-opacity-20 p-6 sm:p-8 lg:p-10 w-full max-w-md mx-auto">
          {/* Logo and title */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-block p-3 lg:p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg mb-4">
              <img src={logo} alt="logo" className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-full" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
            <p className="text-gray-600 text-sm lg:text-base">Enter your email to receive reset instructions</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Email sent successfully!</p>
                  <p className="text-sm mt-1">Check your email for password reset instructions.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
              {error}
            </div>
          )}

          {!success ? (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-4 lg:space-y-6">
                <div className="relative">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </Form>
            </Formik>
          ) : (
            <div className="text-center space-y-4">
              <button
                onClick={() => {
                  setSuccess(false);
                  setError('');
                }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 lg:py-4 px-4 lg:px-6 text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Send Another Email
              </button>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;