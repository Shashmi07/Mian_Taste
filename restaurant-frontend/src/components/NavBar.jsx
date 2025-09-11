import React, { useState, useEffect } from 'react';
import { User, Menu, X, LogOut, ShoppingCart, Package2, ChefHat, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from "../assets/logo.jpeg";

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
      {/* Dark Red Theme Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-xl border-b border-red-600/30 shadow-lg shadow-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section with Enhanced Design */}
            <div className="flex items-center group cursor-pointer" onClick={() => handleMenuClick('home')}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full blur-sm group-hover:blur-md transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
                <img 
                  src={logo}
                  alt="Mian Taste Logo" 
                  className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  Mian Taste
                </h1>
                <p className="text-sm text-gray-300 font-medium">Authentic Asian Cuisine</p>
              </div>
            </div>

            {/* Desktop Navigation Menu with Modern Style */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  className={`relative px-4 py-2 text-base font-semibold capitalize transition-all duration-300 group ${
                    menu === item 
                      ? 'text-red-400' 
                      : 'text-gray-300 hover:text-red-400'
                  }`}
                >
                  <span className="relative z-10">
                    {item === 'table reservation' ? 'Reservations' : 
                     item === 'about' ? 'About' :
                     item === 'preorder' ? 'Pre-Order' :
                     item}
                  </span>
                  {/* Active indicator with smooth animation */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300 ${
                    menu === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              ))}
            </div>

            {/* Right Side Actions with Enhanced Icons */}
            <div className="flex items-center space-x-4">
              
              {/* Order Tracking Button */}
              <button
                onClick={() => {
                  scrollToTop();
                  navigate('/track-order');
                }}
                className="relative p-3 text-gray-300 hover:text-red-400 transition-all duration-300 hover:bg-red-900/20 rounded-xl group"
                title="Track Order"
              >
                <Package2 size={20} className="transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </button>

              {/* Shopping Cart with Enhanced Badge */}
              <button
                onClick={() => {
                  scrollToTop();
                  navigate('/cart');
                }}
                className="relative p-3 text-gray-300 hover:text-red-400 transition-all duration-300 hover:bg-red-900/20 rounded-xl group"
                title="Shopping Cart"
              >
                <ShoppingCart size={20} className="transition-transform duration-300 group-hover:scale-110" />
                {itemCount > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center">
                    <span className="text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full px-1.5 py-0.5 shadow-lg animate-pulse">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  </div>
                )}
              </button>

              {/* Authentication Section with Modern Design */}
              {authState.isAuthenticated && authState.user ? (
                <div className="relative profile-menu">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {(authState.user.username || authState.user.name || 'User').split(' ')[0]}
                    </span>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
                      {/* Profile Header */}
                      <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <User size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-lg">{authState.user.username || authState.user.name || 'User'}</p>
                            <p className="text-sm opacity-90 truncate">{authState.user.email}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="text-yellow-300" />
                              <span className="text-xs opacity-80">Premium Member</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Actions */}
                      <div className="p-3">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                        >
                          <LogOut size={18} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleSignInClick}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <User size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Modern Blur Effect */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modern Mobile Menu Slide Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-gradient-to-b from-gray-900/98 via-gray-800/98 to-black/98 backdrop-blur-xl border-l border-red-600/40 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-red-600/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur-sm opacity-70"></div>
                <img 
                  src={logo}
                  alt="Mian Taste" 
                  className="relative w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Mian Taste
                </h2>
                <p className="text-sm text-gray-400">Menu</p>
              </div>
            </div>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Items with Modern Cards */}
          <div className="flex-1 p-6 space-y-3">
            {menuItems.map((item, index) => (
              <button
                key={item}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group text-left ${
                  menu === item 
                    ? 'bg-gradient-to-r from-red-900/40 to-red-800/40 border-2 border-red-500/50 text-red-400' 
                    : 'hover:bg-red-900/20 text-gray-300 border-2 border-transparent hover:border-red-600/30'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  menu === item
                    ? 'bg-gradient-to-r from-red-500 to-red-400 text-white'
                    : 'bg-gray-700/60 text-gray-400 group-hover:bg-red-700 group-hover:text-red-400'
                }`}>
                  {item === 'home' && <ChefHat size={18} />}
                  {item === 'menu' && <Menu size={18} />}
                  {item === 'preorder' && <Package2 size={18} />}
                  {item === 'table reservation' && <Star size={18} />}
                  {item === 'about' && <User size={18} />}
                </div>
                <div className="flex-1">
                  <span className="text-base font-semibold capitalize">
                    {item === 'table reservation' ? 'Reservations' : 
                     item === 'about' ? 'About' :
                     item === 'preorder' ? 'Pre-Order' :
                     item}
                  </span>
                </div>
                {menu === item && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Authentication Section */}
          <div className="p-6 border-t border-red-600/30">
            {authState.isAuthenticated && authState.user ? (
              <div className="space-y-4">
                {/* User Profile Card */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-2xl text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{authState.user.username || authState.user.name || 'User'}</p>
                      <p className="text-sm opacity-90 truncate">{authState.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-red-900/30 text-red-400 rounded-2xl font-medium transition-all duration-300 hover:bg-red-800/40 group"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleSignInClick}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <User size={18} className="group-hover:scale-110 transition-transform duration-300" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add margin to body content to account for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default NavBar;