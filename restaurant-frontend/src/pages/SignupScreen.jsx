import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customerAPI } from "../services/api";
import { customerRegisterSchema } from '../utils/validation';
import noodles3 from "../assets/MenuItems/beefRamen.jpg";
import noodles1 from "../assets/MenuItems/chickenRamen.jpg";
import noodles from "../assets/ramen.jpg";
import logo from "../assets/logo.jpeg";

const SignupScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const userData = {
        username: values.name,
        email: values.email,
        password: values.password,
        phoneNumber: values.phone,
        address: values.address || ''
      };

      console.log("Attempting to register customer:", userData);
      
      const response = await customerAPI.register(userData);
      
      if (response.data.success) {
        console.log("Registration successful:", response.data);
        alert("Account created successfully! Please login.");
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Registration failed";
        if (error.response.data?.errors) {
          // Validation errors from express-validator
          const validationErrors = error.response.data.errors.map(err => err.msg).join(", ");
          setError(validationErrors);
        } else {
          setError(errorMessage);
        }
      } else if (error.request) {
        // Request made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
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
              Join the Flavor
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500">
                Adventure!
              </span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
              Create your account and start your culinary journey with us.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom/Right side - Signup form */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-4 lg:p-6 min-h-[60vh] lg:min-h-screen">
  <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white border-opacity-20 p-4 sm:p-6 lg:p-6 w-full max-w-md mx-auto">
          <div className="text-center mb-4 lg:mb-6">
            <div className="inline-block p-2 lg:p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg mb-3">
              <img src={logo} alt="logo" className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-full" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">Grand Minato</h1>
            <p className="text-gray-600 text-sm">Create your account</p>
          </div>

          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              address: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={customerRegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-3 lg:space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4">
                {error}
              </div>
            )}
            
                <div className="relative">
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full py-2 lg:py-3 px-3 lg:px-4 pl-8 lg:pl-10 text-sm lg:text-base rounded-lg lg:rounded-xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-2 lg:py-3 px-3 lg:px-4 pl-8 lg:pl-10 text-sm lg:text-base rounded-lg lg:rounded-xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
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
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full py-2 lg:py-3 px-3 lg:px-4 pl-8 lg:pl-10 text-sm lg:text-base rounded-lg lg:rounded-xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <Field
                    name="address"
                    type="text"
                    placeholder="Enter your address (optional)"
                    className="w-full py-2 lg:py-3 px-3 lg:px-4 pl-8 lg:pl-10 text-sm lg:text-base rounded-lg lg:rounded-xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
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
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="w-full py-3 lg:py-4 px-4 lg:px-6 pl-10 lg:pl-12 pr-10 lg:pr-12 text-base rounded-xl lg:rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-transparent placeholder-green-600 text-gray-800 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1 ml-2" />
                  <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 lg:py-3 px-3 lg:px-4 text-sm lg:text-base rounded-lg lg:rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
              {!loading && (
                <svg className="w-4 h-4 lg:w-5 lg:h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-4 lg:mt-6">
            <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors underline"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
