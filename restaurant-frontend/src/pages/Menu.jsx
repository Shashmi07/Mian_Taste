import React, { useState, useEffect } from 'react';
import { Star, Search, Clock, QrCode, X, Calendar } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import { useCart } from '../context/CartContext';

// Import all images from MenuItems folder and create mapping
import chickenRamen from '../assets/MenuItems/chickenRamen.jpg';
import eggRamen from '../assets/MenuItems/eggRamen.jpg';
import porkRamen from '../assets/MenuItems/porkRamen.jpg';
import beefRamen from '../assets/MenuItems/beefRamen.jpg';
import veganRamen from '../assets/MenuItems/veganRamen.jpeg';
import seafoodRamen from '../assets/MenuItems/SeafoodRamen.jpg';
import beefandPorkRamen from '../assets/MenuItems/beefandPorkRamen.jpg';
import buldakChicken from '../assets/MenuItems/buldakChicken.jpg';
import blackRamen from '../assets/MenuItems/blackRamen.jpg';
import buldakPork from '../assets/MenuItems/buldakPork.jpg';
import buldakBeef from '../assets/MenuItems/buldakBeef.jpg';
import beefPorkBuldak from '../assets/MenuItems/beefPorkBuldak.jpg';
import cheeseRamen from '../assets/MenuItems/cheeseRamen.png';
import cheeseChicken from '../assets/MenuItems/cheeseChicken.jpg';
import cheesePork from '../assets/MenuItems/cheesePork.jpg';
import cheeseBeef from '../assets/MenuItems/beefCheese.jpg';
import cheeseBeefPork from '../assets/MenuItems/beefPork.jpg';

// Rice images
import chickenFriedRice from '../assets/MenuItems/rice.png';
import eggRice from '../assets/MenuItems/eggRice.png';
import vegetableRice from '../assets/MenuItems/vegetableRice.jpg';
import porkRice from '../assets/MenuItems/porkRice.jpg';
import beefRice from '../assets/MenuItems/beefRice.jpg';
import porkAndBeefRice from '../assets/MenuItems/beefPorkRice.jpg';

// Soup images
import chickenSoup from '../assets/MenuItems/chickenSoup.jpg';
import beefSoup from '../assets/MenuItems/beefSoup.jpg';
import porkSoup from '../assets/MenuItems/porkSoup.jpg';
import beefPorkSoup from '../assets/MenuItems/beefPorkSoup.jpg';

// Drink images
import coke from '../assets/MenuItems/cocacola.jpg';
import sprite from '../assets/MenuItems/sprite.jpeg';
import gingerBeer from '../assets/MenuItems/gingerBeer.png';
import orange from '../assets/MenuItems/orangeJuice.jpg';
import watermelon from '../assets/MenuItems/watermelon.jpg';

// More images
import wooden from '../assets/MenuItems/wooden.jpg';
import bamboo from '../assets/MenuItems/bamboo.jpg';

// Default image for fallback
import ramenDefault from '../assets/ramen.jpg';

// Create image mapping
const imageMap = {
  // Ramen images
  'chickenRamen.jpg': chickenRamen,
  'eggRamen.jpg': eggRamen,
  'porkRamen.jpg': porkRamen,
  'beefRamen.jpg': beefRamen,
  'veganRamen.jpeg': veganRamen,
  'SeafoodRamen.jpg': seafoodRamen,
  'beefandPorkRamen.jpg': beefandPorkRamen,
  'buldakChicken.jpg': buldakChicken,
  'blackRamen.jpg': blackRamen,
  'buldakPork.jpg': buldakPork,
  'buldakBeef.jpg': buldakBeef,
  'beefPorkBuldak.jpg': beefPorkBuldak,
  'cheeseRamen.png': cheeseRamen,
  'cheeseChicken.jpg': cheeseChicken,
  'cheesePork.jpg': cheesePork,
  'beefCheese.jpg': cheeseBeef,
  'beefPork.jpg': cheeseBeefPork,
  
  // Rice images
  'rice.png': chickenFriedRice,
  'eggRice.png': eggRice,
  'vegetableRice.jpg': vegetableRice,
  'porkRice.jpg': porkRice,
  'beefRice.jpg': beefRice,
  'beefPorkRice.jpg': porkAndBeefRice,
  
  // Soup images
  'chickenSoup.jpg': chickenSoup,
  'beefSoup.jpg': beefSoup,
  'porkSoup.jpg': porkSoup,
  'beefPorkSoup.jpg': beefPorkSoup,
  
  // Drink images
  'cocacola.jpg': coke,
  'sprite.jpeg': sprite,
  'gingerBeer.png': gingerBeer,
  'orangeJuice.jpg': orange,
  'watermelon.jpg': watermelon,
  
  // More images
  'wooden.jpg': wooden,
  'bamboo.jpg': bamboo
};

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart } = useCart();
  
  // QR Code table selection
  const [searchParams] = useSearchParams();
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [isQROrder, setIsQROrder] = useState(false);
  
  // Reservation context
  const [reservationContext, setReservationContext] = useState(null);
  const [isReservationOrder, setIsReservationOrder] = useState(false);
  
  // Check if this is a QR code access
  useEffect(() => {
    try {
      const qrParam = searchParams.get('qr');
      const tableParam = searchParams.get('table');
      
      console.log('QR params:', { qrParam, tableParam });
      
      if (qrParam === 'true' || tableParam) {
        setIsQROrder(true);
        if (tableParam && tableParam.trim()) {
          const cleanTableParam = tableParam.trim();
          console.log('Setting QR table from URL:', cleanTableParam);
          setSelectedTable(cleanTableParam);
          // Store table number in localStorage for the entire session
          localStorage.setItem('qrTableNumber', cleanTableParam);
        } else {
          setShowTableModal(true);
        }
      }
    } catch (error) {
      console.error('Error processing QR parameters:', error);
      // Reset QR state if there's an error
      setIsQROrder(false);
      setSelectedTable(null);
      localStorage.removeItem('qrTableNumber');
    }
  }, [searchParams]);
  
  // Check for reservation context
  useEffect(() => {
    const storedReservationContext = localStorage.getItem('reservationContext');
    if (storedReservationContext) {
      try {
        const context = JSON.parse(storedReservationContext);
        setReservationContext(context);
        setIsReservationOrder(true);
        console.log('Reservation context found:', context);
      } catch (error) {
        console.error('Error parsing reservation context:', error);
        localStorage.removeItem('reservationContext');
      }
    }
  }, []);

  // Fetch menu items from database
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        console.log('Fetching menu items...');
        // Dynamic API URL based on current hostname
        const apiUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:5000/api/menu'
          : `http://${window.location.hostname}:5000/api/menu`;
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('Menu items loaded:', data.length, data); // Debug log
          
          // Validate that we received an array
          if (!Array.isArray(data)) {
            console.error('Menu data is not an array:', data);
            setAllMenuItems([]);
            return;
          }
          
          // Validate each menu item has required fields
          const validatedData = data.filter(item => {
            const isValid = item._id && item.name && item.price && item.category;
            if (!isValid) {
              console.warn('Invalid menu item found:', item);
            }
            return isValid;
          });
          
          console.log('Valid menu items:', validatedData.length);
          setAllMenuItems(validatedData);
        } else {
          console.error('Failed to fetch menu items, status:', response.status);
          setAllMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setAllMenuItems([]);
        alert('Failed to load menu items. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Helper function to get image from mapping
  const getItemImage = (imageName) => {
    try {
      // Check if imageName is valid
      if (!imageName || typeof imageName !== 'string') {
        console.warn('Invalid image name:', imageName);
        return ramenDefault;
      }
      
      // Clean the image name (remove any file path separators)
      const cleanImageName = imageName.replace(/[\\\/]/g, '').split('/').pop().split('\\').pop();
      
      const image = imageMap[cleanImageName] || imageMap[imageName];
      return image || ramenDefault;
    } catch (error) {
      console.error('Error getting item image:', error, 'for image:', imageName);
      return ramenDefault;
    }
  };

  const categories = ['All', 'Ramen', 'Rice', 'Soup', 'Drinks', 'More'];

  // Filter items based on active category and search term
  const filteredItems = allMenuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle add to cart
  const handleAddToCart = async (item) => {
    try {
      console.log('Adding item to cart:', item);
      setAddingToCart(item._id);
      
      // Validate item data
      if (!item._id || !item.name || !item.price) {
        throw new Error('Invalid item data');
      }
      
      // Parse price more safely
      let priceValue;
      if (typeof item.price === 'string') {
        priceValue = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
      } else if (typeof item.price === 'number') {
        priceValue = item.price;
      } else {
        priceValue = 0;
      }
      
      // Get image safely
      let itemImage;
      try {
        itemImage = getItemImage(item.image);
      } catch (imgError) {
        console.warn('Error getting item image:', imgError);
        itemImage = ramenDefault; // fallback to default image
      }
      
      const cartItem = {
        id: item._id,
        name: item.name,
        description: item.description || 'Delicious and freshly prepared',
        price: priceValue,
        image: itemImage,
        category: item.category,
        rating: item.rating
      };
      
      console.log('Cart item being added:', cartItem);
      
      // Add a small delay to show loading state on mobile
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (typeof addToCart !== 'function') {
        throw new Error('Cart context not available');
      }
      
      addToCart(cartItem);
      
      // Brief success feedback
      setTimeout(() => {
        setAddingToCart(null);
      }, 700);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(null);
      // Show user-friendly error message
      alert('Error adding item to cart. Please try again.');
    }
  };

  // Handle table selection for QR orders
  const handleTableSelection = (tableNumber) => {
    try {
      console.log('Setting QR table number:', tableNumber);
      setSelectedTable(tableNumber);
      localStorage.setItem('qrTableNumber', tableNumber);
      setShowTableModal(false);
    } catch (error) {
      console.error('Error setting QR table number:', error);
      alert('Error setting table number. Please try again.');
    }
  };

  const closeTableModal = () => {
    setShowTableModal(false);
    // If they close without selecting, redirect to regular menu
    setIsQROrder(false);
    localStorage.removeItem('qrTableNumber');
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={i} 
          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="w-4 h-4 text-gray-300" 
        />
      );
    }
    
    return stars;
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* QR Order Badge */}
      {isQROrder && selectedTable && (
        <div className="fixed top-20 left-4 z-40 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            <span className="text-sm font-semibold">Table {selectedTable}</span>
          </div>
        </div>
      )}
      
      {/* Reservation Order Badge */}
      {isReservationOrder && reservationContext && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Adding food to your table reservation
                  </p>
                  <p className="text-xs text-blue-700">
                    {reservationContext.customerName} • Tables {reservationContext.tableDetails.tables.join(', ')} • {reservationContext.tableDetails.date} {reservationContext.tableDetails.timeSlot}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('reservationContext');
                  setReservationContext(null);
                  setIsReservationOrder(false);
                }}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header with Search Bar */}
      <div className="bg-white shadow-sm sticky top-20 z-10 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="relative w-full max-w-sm md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-gray-600 cursor-pointer">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-red-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 bg-gray-100 hover:bg-red-500 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">{category}</span>
                <span className="sm:hidden">{category === 'All' ? 'All' : category.slice(0, 6)}</span>
                {category !== 'All' && <span className="hidden md:inline"> ({allMenuItems.filter(item => item.category === category).length})</span>}
              </button>
            ))}
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Found <span className="font-semibold text-red-600">{filteredItems.length}</span> items for "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading menu items...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest menu</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No items match "${searchTerm}"` : 'No items in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-[280px] md:h-[380px] group border border-gray-100 hover:border-red-200">
                
                {/* Image with Heart Icon */}
                <div className="relative h-36 md:h-56 overflow-hidden bg-gray-100">
                  <img 
                    src={getItemImage(item.image)} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Heart Icon - Top Right */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg">
                    <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {item.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  
                  {/* Top Content */}
                  <div className="flex-grow">
                    {/* Item Name */}
                    <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-1 md:mb-2 leading-tight line-clamp-2">
                      {item.name}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 leading-relaxed line-clamp-2">
                      {item.description || 'Delicious and freshly prepared'}
                    </p>
                    
                    {/* Rating and Time Row - Only for food items */}
                    {(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                      <div className="flex items-center justify-between mb-2 md:mb-3 text-xs md:text-sm">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {renderStars(item.rating || 4.5)}
                          <span className="ml-1 font-medium text-gray-900 hidden md:inline">{item.rating || 4.5}</span>
                        </div>
                        
                        {/* Cooking Time */}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                          <span className="hidden md:inline">15-20 min</span>
                          <span className="md:hidden">15min</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom Content - Price and Add to Cart Row */}
                  <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-100 gap-3">
                    <div className="flex flex-col flex-shrink-0">
                      <span className="text-base sm:text-lg md:text-xl font-bold text-red-600">{item.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart === item._id}
                      className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-1 md:gap-2 shadow-md hover:shadow-lg flex-shrink-0 ${
                        addingToCart === item._id 
                          ? 'bg-green-500 cursor-not-allowed min-w-[60px] sm:min-w-[70px]' 
                          : 'bg-red-600 hover:bg-red-700 active:scale-95 min-w-[50px] sm:min-w-[60px]'
                      }`}
                    >
                      {addingToCart === item._id ? (
                        <>
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="hidden sm:inline">Added</span>
                          <span className="sm:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Table Selection Modal for QR Orders */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Mian Taste!</h2>
              <p className="text-gray-600">Please confirm your table number to get started</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Table</label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelection(tableNum.toString())}
                    className="h-12 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
                  >
                    {tableNum}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or enter table number</label>
              <input
                type="text"
                placeholder="Enter table number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleTableSelection(e.target.value.trim());
                  }
                }}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={closeTableModal}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter table number"]');
                  if (input.value.trim()) {
                    handleTableSelection(input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-3 bg-[#46923c] text-white rounded-lg hover:bg-[#5BC142] transition-colors"
              >
                Confirm
              </button>
            </div>
            
            <button
              onClick={closeTableModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
    
    <Footer />
    </>
  );
};

export default Menu;