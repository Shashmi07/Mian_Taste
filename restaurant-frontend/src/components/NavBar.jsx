import React, { useState, useEffect } from 'react';
import { User, Menu, X, LogOut, MapPin, ShoppingCart, Package2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from "../assets/logo.jpeg";
import Cart from "../assets/cart.png";

const NavBar = () => {
  const [menu, setMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  // Updated menu order: moved 'about' to 5th position (end)
  const menuItems = ['home', 'menu', 'preorder', 'table reservation', 'about'];

  // Function to determine active menu based on current path
  const getActiveMenuFromPath = (pathname) => {
    if (pathname === '/' || pathname === '/home') return 'home';
    if (pathname === '/menu') return 'menu';
    if (pathname === '/preorder') return 'preorder';
    if (pathname === '/table-reservation') return 'table reservation';
    if (pathname === '/about') return 'about';
    // For other pages, don't highlight any menu item
    return null;
  };

  // Update active menu based on current location
  useEffect(() => {
    const activeMenu = getActiveMenuFromPath(location.pathname);
    setMenu(activeMenu); // This will be null for pages not in main menu
  }, [location.pathname]);

  // Hide navbar on certain pages
  const shouldHideNavbar = () => {
    const hiddenPages = ['/cart'];
    return hiddenPages.includes(location.pathname);
  };

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

  const scrollToTop = () => {
    console.log('🔝 Scrolling to top...');
    
    // Multiple methods to ensure smooth scroll to top works
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Backup methods
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    document.body.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Final fallback with delay
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleMenuClick = (item) => {
    setMenu(item);
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
    
    // Get current path to check if we're navigating to the same page
    const currentPath = location.pathname;
    let targetPath = '/';
    
    // Determine target path
    switch(item) {
      case 'home':
        targetPath = '/';
        break;
      case 'menu':
        targetPath = '/menu';
        break;
      case 'about':
        targetPath = '/about';
        break;
      case 'preorder':
        targetPath = '/preorder';
        break;
      case 'table reservation':
        targetPath = '/table-reservation';
        break;
      default:
        targetPath = '/';
    }
    
    // If same page, just scroll to top
    if (currentPath === targetPath) {
      scrollToTop();
    } else {
      // Don't automatically clean up preorder context from navbar navigation
      // Let specific actions handle cleanup instead
      
      // Different page: navigate first, then scroll
      navigate(targetPath);
      
      // Scroll after navigation with delay
      setTimeout(() => {
        scrollToTop();
      }, 200);
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

  // Don't render navbar if it should be hidden
  if (shouldHideNavbar()) {
    return null;
  }

  return (
    <>
      <nav 
        className="fixed top-0 w-full flex items-center h-20 z-50 shadow-lg px-4 md:px-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      >
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo}
            alt="logo" 
            className="w-12 h-12 md:w-15 md:h-15 rounded-full cursor-pointer"
            onClick={() => handleMenuClick('home')} // Will navigate to Homepage and scroll to top
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
                  : 'hover:text-red-400 text-gray-200'
              }`}
              style={menu === item ? { 
                borderBottomColor: '#dc2626',
                color: '#dc2626' 
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
          {/* Order Tracking Icon */}
          <div 
            className="relative cursor-pointer"
            onClick={() => {
              scrollToTop();
              navigate('/track-order');
            }}
          >
            <Package2 
              size={28}
              className="text-gray-300 hover:text-red-400 transition-colors duration-300"
            />
          </div>

          <div 
            className="relative cursor-pointer"
            onClick={() => {
              scrollToTop();
              navigate('/cart');
            }}
          >
            <ShoppingCart 
              size={28}
              className="text-gray-300 hover:text-red-400 transition-colors duration-300"
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white px-1">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>


          {/* Authentication Section */}
          {authState.isAuthenticated && authState.user ? (
            <div className="relative profile-menu" key={`authenticated-${authState.user.email}`}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-red-600 bg-opacity-90 backdrop-blur-sm text-sm font-medium px-4 py-2 lg:px-5 lg:py-3 border-2 border-red-400 border-opacity-50 rounded-xl cursor-pointer transition-all duration-300 hover:bg-red-700 hover:shadow-lg transform hover:scale-105"
                style={{
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
                }}
              >
                <User size={20} className="text-white" />
                <span className="hidden lg:block text-sm font-semibold">
                  {authState.user.username || authState.user.name || 'User'}
                </span>
              </button>

              {/* Enhanced Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white">
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
                          scrollToTop();
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
              className="flex items-center gap-2 bg-transparent text-sm font-medium px-3 py-2 lg:px-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{
                color: '#f3f4f6',
                borderColor: '#f3f4f6'
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
          {/* Mobile Order Tracking Icon */}
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/track-order')}
          >
            <Package2 
              size={24}
              className="text-gray-300 hover:text-red-400 transition-colors duration-300"
            />
          </div>

          {/* Mobile Cart Icon */}
          <div 
            className="relative cursor-pointer"
            onClick={() => {
              scrollToTop();
              navigate('/cart');
            }}
          >
            <ShoppingCart 
              size={24}
              className="text-gray-300 hover:text-red-400 transition-colors duration-300"
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white px-1">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: '#f3f4f6' }}
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
        className={`fixed top-20 right-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden bg-gradient-to-b from-gray-800 to-gray-900 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
                    ? 'text-red-400 border-l-4 border-red-400 pl-4' 
                    : 'text-gray-200 hover:text-red-400 pl-4'
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
            <div className="border-t border-gray-600 pt-6 mt-6">
              <div className="bg-red-600 bg-opacity-90 backdrop-blur-sm px-4 py-4 border border-red-400 border-opacity-50 rounded-xl mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <User size={24} className="text-white" />
                  <div>
                    <p className="font-semibold text-white">{authState.user.username || authState.user.name || 'User'}</p>
                    <p className="text-sm text-red-100">{authState.user.email}</p>
                  </div>
                </div>
                
                {authState.type === 'customer' && (
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 bg-white bg-opacity-20 font-medium px-4 py-3 border border-white border-opacity-50 rounded-lg cursor-pointer transition-all duration-300 mb-3 text-white"
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
              className="flex items-center gap-3 bg-transparent font-medium px-4 py-3 border-2 rounded-lg cursor-pointer transition-all duration-300 mx-4 hover:bg-red-600 hover:text-white"
              style={{
                color: '#f3f4f6',
                borderColor: '#f3f4f6'
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