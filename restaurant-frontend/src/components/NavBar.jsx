import React, { useState, useEffect } from 'react';
import { User, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.jpeg";
import Cart from "../assets/cart.png";

const NavBar = () => {
  const [menu, setMenu] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });
  const navigate = useNavigate();
  // Updated menu order: moved 'about' to 5th position (end)
  const menuItems = ['home', 'menu', 'preorder', 'table reservation', 'about'];

  // Check for customer authentication
  const checkAuth = () => {
    // Check for customer authentication first
    const customerToken = localStorage.getItem('customerToken');
    const customerUser = localStorage.getItem('customerUser');
    
    if (customerToken && customerUser) {
      try {
        const userData = JSON.parse(customerUser);
        setAuthState({
          isAuthenticated: true,
          user: userData,
          type: 'customer'
        });
        return;
      } catch (error) {
        console.error('Error parsing customer data:', error);
        localStorage.removeItem('customerUser');
        localStorage.removeItem('customerToken');
      }
    }
    
    // Fallback to admin/chef authentication
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user: userData,
          type: 'admin'
        });
        return;
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    // No authentication found
    setAuthState({
      isAuthenticated: false,
      user: null,
      type: null
    });
  };

  // Check auth on mount and set up listeners
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    // Clear customer authentication
    localStorage.removeItem('customerUser');
    localStorage.removeItem('customerToken');
    
    // Clear admin authentication (fallback)
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      type: null
    });
    setShowProfileMenu(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
    
    navigate('/');
  };

  const handleMenuClick = (item) => {
    setMenu(item);
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
    
    // Navigation logic - Updated to use Homepage
    switch(item) {
      case 'home':
        navigate('/'); // This will load Homepage.jsx
        break;
      case 'menu':
        navigate('/menu');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'preorder':
        navigate('/preorder');
        break;
      case 'table reservation':
        navigate('/table-reservation');
        break;
      default:
        navigate('/'); // Default to Homepage
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Sign In button clicked'); // Debug log
    console.log('Current auth state:', authState); // Debug auth state
    
    // Try multiple approaches to ensure navigation works
    try {
      // Method 1: React Router navigate
      navigate('/login');
      
      // Method 2: Fallback - direct window location (if navigate fails)
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
      // Method 3: Last resort - direct location change
      window.location.href = '/login';
    }
    
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav 
        className="fixed top-0 w-full flex items-center h-20 z-50 shadow-md px-4 md:px-10" 
        style={{ backgroundColor: '#78D860' }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo}
            alt="logo" 
            className="w-12 h-12 md:w-15 md:h-15 rounded-full cursor-pointer"
            onClick={() => handleMenuClick('home')} // Will navigate to Homepage
          />
        </div>

        {/* Desktop Menu Items */}
        <ul className="hidden md:flex m-0 p-0 list-none font-semibold text-lg flex-1 justify-center gap-5 lg:gap-8">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => handleMenuClick(item)}
              className={`cursor-pointer capitalize transition-all duration-300 ${
                menu === item 
                  ? 'pb-0.5 border-b-2' 
                  : 'hover:text-blue-500 text-gray-700'
              }`}
              style={menu === item ? { 
                borderBottomColor: '#49557e',
                color: '#49557e' 
              } : {}}
            >
              {item === 'table reservation' ? 'Table Reservation' : 
               item === 'about' ? 'About Us' :
               item === 'preorder' ? 'Pre-Order' :
               item}
            </li>
          ))}
        </ul>

        {/* Desktop Right Side Icons - Removed Search Icon */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="relative cursor-pointer">
            <img 
              src={Cart}
              alt="Cart" 
              className="w-6 h-6 lg:w-10 lg:h-10 hover:opacity-70 transition-opacity duration-300"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white bg-red-500"></span>
          </div>

          {/* Authentication Section */}
          {authState.isAuthenticated && authState.user ? (
            <div className="relative profile-menu" key={`authenticated-${authState.user.email}`}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm text-sm font-medium px-4 py-2 lg:px-5 lg:py-3 border-2 border-white border-opacity-30 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white hover:bg-opacity-30 hover:shadow-lg transform hover:scale-105"
                style={{
                  color: '#2d3748',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <User size={20} className="text-blue-600" />
                <span className="hidden lg:block text-sm font-semibold">
                  {authState.user.username || authState.user.name || 'User'}
                </span>
              </button>

              {/* Enhanced Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{authState.user.username || authState.user.name || 'User'}</p>
                        <p className="text-sm opacity-90">{authState.user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {authState.type === 'customer' && (
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 rounded-lg transition-colors"
                      >
                        <User size={18} />
                        <span className="font-medium">My Profile</span>
                      </button>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 p-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              key="sign-in-button"
              onClick={handleSignInClick}
              type="button"
              className="flex items-center gap-2 bg-transparent text-sm font-medium px-3 py-2 lg:px-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                color: '#49557e',
                borderColor: '#49557e'
              }}
              aria-label="Sign In"
            >
              <User size={16} />
              <span className="hidden lg:inline">Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Icons */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          {/* Mobile Cart Icon */}
          <div className="relative cursor-pointer">
            <img 
              src={Cart}
              alt="Cart" 
              className="w-6 h-6"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white bg-red-500"></span>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: '#49557e' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide Panel - Removed Search from mobile menu */}
      <div 
        className={`fixed top-20 right-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#78D860' }}
      >
        <div className="flex flex-col p-6">
          {/* Mobile Menu Items */}
          <ul className="flex flex-col gap-6 mb-8">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleMenuClick(item)}
                className={`cursor-pointer capitalize font-semibold text-lg transition-all duration-300 ${
                  menu === item 
                    ? 'text-blue-800 border-l-4 border-blue-800 pl-4' 
                    : 'text-gray-700 hover:text-blue-500 pl-4'
                }`}
              >
                {item === 'table reservation' ? 'Table Reservation' : 
                 item === 'about' ? 'About Us' :
                 item === 'preorder' ? 'Pre-Order' :
                 item}
              </li>
            ))}
          </ul>

          {/* Mobile Authentication Section */}
          {authState.isAuthenticated && authState.user ? (
            <div className="border-t border-white border-opacity-30 pt-6 mt-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-4 border border-white border-opacity-30 rounded-xl mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <User size={24} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{authState.user.username || authState.user.name || 'User'}</p>
                    <p className="text-sm text-gray-600">{authState.user.email}</p>
                  </div>
                </div>
                
                {authState.type === 'customer' && (
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 bg-white bg-opacity-30 font-medium px-4 py-3 border border-white border-opacity-50 rounded-lg cursor-pointer transition-all duration-300 mb-3 text-gray-700"
                  >
                    <User size={20} />
                    My Profile
                  </button>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 bg-red-500 bg-opacity-20 font-medium px-4 py-3 border border-red-400 border-opacity-50 rounded-lg cursor-pointer transition-all duration-300 text-red-700"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleSignInClick}
              className="flex items-center gap-3 bg-transparent font-medium px-4 py-3 border-2 rounded-lg cursor-pointer transition-all duration-300 mx-4 hover:bg-blue-600 hover:text-white"
              style={{
                color: '#49557e',
                borderColor: '#49557e'
              }}
            >
              <User size={20} />
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Add margin to body content to account for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default NavBar;