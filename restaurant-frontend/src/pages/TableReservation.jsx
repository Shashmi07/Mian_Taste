import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Plus, Minus, ShoppingBag, Star, UtensilsCrossed, Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';
import { createReservation, checkAvailability } from '../services/tableReservationAPI';

// Import menu item images
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
import chickenFriedRice from '../assets/MenuItems/rice.png';
import eggRice from '../assets/MenuItems/eggRice.png';
import vegetableRice from '../assets/MenuItems/vegetableRice.jpg';
import porkRice from '../assets/MenuItems/porkRice.jpg';
import beefRice from '../assets/MenuItems/beefRice.jpg';
import porkAndBeefRice from '../assets/MenuItems/beefPorkRice.jpg';
import chickenSoup from '../assets/MenuItems/chickenSoup.jpg';
import beefSoup from '../assets/MenuItems/beefSoup.jpg';
import porkSoup from '../assets/MenuItems/porkSoup.jpg';
import beefPorkSoup from '../assets/MenuItems/beefPorkSoup.jpg';
import coke from '../assets/MenuItems/cocacola.jpg';
import sprite from '../assets/MenuItems/sprite.jpeg';
import gingerBeer from '../assets/MenuItems/gingerBeer.png';
import orange from '../assets/MenuItems/orangeJuice.jpg';
import watermelon from '../assets/MenuItems/watermelon.jpg';
import wooden from '../assets/MenuItems/wooden.jpg';
import bamboo from '../assets/MenuItems/bamboo.jpg';
import eggSoup from '../assets/MenuItems/eggSoup.jpg';
import hotEggSpicy from '../assets/MenuItems/hoteggspicy.jpg';
import sutahRamenVeg from '../assets/MenuItems/sutahramenveg.jpg';
import cheeseRamenChicken from '../assets/MenuItems/cheeseramenchicken.jpg';
import buldakBeefPork from '../assets/MenuItems/buldakBeefPork.jpg';
import ramenDefault from '../assets/ramen.jpg';

// Image mapping
const imageMap = {
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
  'rice.png': chickenFriedRice,
  'eggRice.png': eggRice,
  'vegetableRice.jpg': vegetableRice,
  'porkRice.jpg': porkRice,
  'beefRice.jpg': beefRice,
  'beefPorkRice.jpg': porkAndBeefRice,
  'chickenSoup.jpg': chickenSoup,
  'beefSoup.jpg': beefSoup,
  'porkSoup.jpg': porkSoup,
  'beefPorkSoup.jpg': beefPorkSoup,
  'cocacola.jpg': coke,
  'sprite.jpeg': sprite,
  'gingerBeer.png': gingerBeer,
  'orangeJuice.jpg': orange,
  'watermelon.jpg': watermelon,
  'wooden.jpg': wooden,
  'bamboo.jpg': bamboo,
  'eggSoup.jpg': eggSoup,
  'hoteggspicy.jpg': hotEggSpicy,
  'sutahramenveg.jpg': sutahRamenVeg,
  'cheeseramenchicken.jpg': cheeseRamenChicken,
  'buldakBeefPork.jpg': buldakBeefPork
};

// Table pricing constant
const TABLE_PRICE_PER_TABLE = 500;

export default function TableReservation() {
  const navigate = useNavigate();
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTables, setAvailableTables] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    specialRequests: ''
  });
  
  // Pre-order functionality states
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [justAdded, setJustAdded] = useState(null);
  const categories = ['All', 'Ramen', 'Rice', 'Soup', 'Drinks', 'More'];

  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  const today = new Date().toISOString().split('T')[0];

  // Check availability when date or time slot changes
  const checkTableAvailability = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await checkAvailability(selectedDate, selectedTimeSlot);
      if (response.success) {
        setAvailableTables(response.availableTables);
        // Clear selected tables if they're no longer available
        setSelectedTables(prev => prev.filter(tableId => response.availableTables.includes(tableId)));
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking table availability. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTimeSlot]);

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      checkTableAvailability();
    }
  }, [selectedDate, selectedTimeSlot, checkTableAvailability]);

  // Load menu items when pre-order is enabled
  useEffect(() => {
    if (showPreOrder && menuItems.length === 0) {
      loadMenuItems();
    }
  }, [showPreOrder]);

  const loadMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await fetch('http://10.11.5.232:5000/api/menu');
      if (response.ok) {
        const data = await response.json();
        console.log('Menu items loaded:', data.length);
        console.log('Sample menu item:', data[0]); // Debug first item
        console.log('Categories found:', [...new Set(data.map(item => item.category))]);
        setMenuItems(data);
        setFilteredItems(data); // Initially show all items
      } else {
        console.error('Failed to fetch menu items, status:', response.status);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setMenuLoading(false);
    }
  };

  // Filter menu items based on category and search term
  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, activeCategory, searchTerm]);

  // Get item image from mapping or fallback to default
  const getItemImage = (imageName) => {
    return imageMap[imageName] || ramenDefault;
  };

  // Extract numeric price from database price string
  const getNumericPrice = (priceString) => {
    return parseInt((priceString || '0').toString().replace(/[^0-9]/g, '')) || 0;
  };

  const handleTableSelect = (tableId) => {
    if (!availableTables.includes(tableId)) return;
    
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Pre-order functions
  const addItemToOrder = async (item) => {
    // Set loading state for this specific item
    setAddingToCart(item._id);
    
    // Simulate a brief loading time for visual feedback
    setTimeout(() => {
      setSelectedItems(prev => {
        const existingItem = prev.find(i => i._id === item._id);
        if (existingItem) {
          return prev.map(i => 
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [...prev, { ...item, quantity: 1 }];
        }
      });
      
      // Show "Added!" state
      setAddingToCart(null);
      setJustAdded(item._id);
      
      // Reset to normal after showing success
      setTimeout(() => {
        setJustAdded(null);
      }, 1000);
    }, 400);
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedItems(prev => prev.filter(item => item._id !== itemId));
    } else {
      setSelectedItems(prev => 
        prev.map(item => 
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getOrderTotal = () => {
    return selectedItems.reduce((total, item) => {
      const price = getNumericPrice(item.price);
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getTableTotal = () => {
    return selectedTables.length * TABLE_PRICE_PER_TABLE;
  };

  const getReservationGrandTotal = () => {
    return getTableTotal() + getOrderTotal();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4.5);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    return stars;
  };

  const handleReserve = async () => {
    // Validation
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }
    if (selectedTables.length === 0) {
      alert('Please select at least one table');
      return;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }

    try {
      setLoading(true);
      
      const reservationData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        reservationDate: selectedDate,
        timeSlot: selectedTimeSlot,
        selectedTables: selectedTables,
        numberOfGuests: parseInt(customerInfo.guests) || 1,
        specialRequests: customerInfo.specialRequests,
        preOrder: selectedItems.length > 0 ? {
          items: selectedItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: getOrderTotal()
        } : null,
        tableCost: {
          numberOfTables: selectedTables.length,
          pricePerTable: TABLE_PRICE_PER_TABLE,
          totalTableCost: getTableTotal()
        },
        grandTotal: getReservationGrandTotal()
      };

      // Store reservation data for payment processing
      localStorage.setItem('pendingReservation', JSON.stringify({
        type: 'reservation',
        data: reservationData,
        total: getReservationGrandTotal(),
        createdAt: new Date().toISOString()
      }));

      // Navigate to payment gateway
      navigate('/payment');
    } catch (error) {
      console.error('Error preparing reservation:', error);
      alert('Failed to prepare reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTableButtonClass = (tableNum) => {
    const isSelected = selectedTables.includes(tableNum);
    const isAvailable = availableTables.includes(tableNum);
    
    if (isSelected) {
      return 'bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105';
    } else if (isAvailable) {
      return 'bg-green-500 border-green-600 text-white hover:bg-green-600 hover:shadow-md hover:transform hover:scale-105 active:bg-green-700';
    } else {
      return 'bg-red-500 border-red-600 text-white cursor-not-allowed opacity-80';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="relative h-32 flex items-center justify-center pt-24">
        <h1 className="text-gray-800 text-3xl font-bold tracking-wide drop-shadow-lg">
          Table Reservation
        </h1>
      </div>
      
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  value={customerInfo.guests}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={customerInfo.specialRequests}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Any special requests or dietary requirements..."
                maxLength="500"
              />
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Date & Time
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Select Time Slot *
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-2 text-center">
              Select Tables {loading && <span className="text-sm text-gray-500">(Checking availability...)</span>}
            </h2>
            <div className="text-center mb-6">
              <p className="text-red-600 font-semibold text-sm bg-red-50 inline-block px-4 py-2 rounded-full">
                💰 Rs.{TABLE_PRICE_PER_TABLE} per table reservation
              </p>
            </div>
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border"></div>
                <span className="text-sm text-gray-600">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleTableSelect(1)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(1)}
                `}
                disabled={!availableTables.includes(1) || loading}
              >
                Table 1
              </button>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelect(tableNum)}
                    className={`
                      h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                      ${getTableButtonClass(tableNum)}
                    `}
                    disabled={!availableTables.includes(tableNum) || loading}
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[5, 6, 7].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelect(tableNum)}
                    className={`
                      h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                      ${getTableButtonClass(tableNum)}
                    `}
                    disabled={!availableTables.includes(tableNum) || loading}
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleTableSelect(8)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(8)}
                `}
                disabled={!availableTables.includes(8) || loading}
              >
                Table 8
              </button>
            </div>
          </div>

          {/* Pre-Order Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-800 text-xl font-semibold">
                <UtensilsCrossed size={20} className="inline mr-2" />
                Pre-Order Food (Optional)
              </h2>
              <button
                onClick={() => setShowPreOrder(!showPreOrder)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showPreOrder 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showPreOrder ? 'Hide Menu' : 'Add Food Orders'}
              </button>
            </div>

            {showPreOrder && (
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-4">
                  🍽️ Pre-order your favorite dishes and have them ready when you arrive!
                </p>

                {menuLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading menu items...</p>
                  </div>
                ) : (
                  <>
                    {/* Search Bar */}
                    <div className="mb-6">
                      <div className="relative max-w-md mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search menu items..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <span className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer">×</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                            activeCategory === category
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          {category} {category !== 'All' && `(${menuItems.filter(item => item.category === category).length})`}
                        </button>
                      ))}
                    </div>

                    {/* Search Results Info */}
                    {searchTerm && (
                      <div className="text-center mb-4">
                        <p className="text-gray-600 text-sm">
                          Found <span className="font-semibold text-red-600">{filteredItems.length}</span> items for "{searchTerm}"
                        </p>
                      </div>
                    )}

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                      {filteredItems.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                          <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                          <p className="text-gray-500">
                            {searchTerm ? `No items match "${searchTerm}"` : `No items in ${activeCategory} category`}
                          </p>
                        </div>
                      ) : (
                        filteredItems.map((item) => (
                          <div key={item._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden">
                              <img 
                                src={getItemImage(item.image)} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = ramenDefault;
                                }}
                              />
                              {/* Category Badge */}
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h4 className="font-bold text-gray-900 mb-1 leading-tight">{item.name}</h4>
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                {item.description || 'Delicious and freshly prepared'}
                              </p>
                              
                              {/* Rating and Time */}
                              {(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                                <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                                  <div className="flex items-center gap-1">
                                    {renderStars(item.rating)}
                                    <span className="ml-1 font-medium text-gray-900">{item.rating || 4.5}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span>15-20 min</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Price and Add Button */}
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-red-600">Rs. {getNumericPrice(item.price)}</span>
                                <button
                                  onClick={() => addItemToOrder(item)}
                                  disabled={addingToCart === item._id || justAdded === item._id}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md min-w-[85px] ${
                                    addingToCart === item._id
                                      ? 'bg-orange-500 text-white cursor-wait'
                                      : justAdded === item._id
                                      ? 'bg-green-500 text-white scale-105'
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                  }`}
                                >
                                  {addingToCart === item._id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                      Adding...
                                    </>
                                  ) : justAdded === item._id ? (
                                    <>
                                      <Check size={14} className="animate-bounce" />
                                      Added!
                                    </>
                                  ) : (
                                    <>
                                      <Plus size={14} />
                                      Add
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Order Summary */}
                    {selectedItems.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ShoppingBag size={18} />
                          Your Pre-Order ({selectedItems.length} items)
                        </h4>
                        <div className="space-y-2 mb-4">
                          {selectedItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex-1">
                                <span className="font-medium text-sm">{item.name}</span>
                                <div className="text-xs text-gray-600">Rs. {getNumericPrice(item.price)} each</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                                  className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                                  className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-sm"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <div className="ml-3 text-sm font-medium text-red-600">
                                Rs. {getNumericPrice(item.price) * (parseInt(item.quantity) || 0)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-gray-200 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Food Total:</span>
                            <span className="font-semibold text-red-600">Rs.{getOrderTotal()}</span>
                          </div>
                          {selectedTables.length > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">Table Cost ({selectedTables.length} × Rs.{TABLE_PRICE_PER_TABLE}):</span>
                              <span className="font-semibold text-red-600">Rs.{getTableTotal()}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2 border-t border-red-200">
                            <span className="font-bold text-gray-900 text-lg">Grand Total:</span>
                            <span className="font-bold text-red-600 text-xl">Rs.{getReservationGrandTotal()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Reservation Summary */}
          {(selectedTables.length > 0 || selectedDate || selectedTimeSlot) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Reservation Summary:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {customerInfo.name && <p>👤 Name: {customerInfo.name}</p>}
                {customerInfo.guests && <p>👥 Guests: {customerInfo.guests}</p>}
                {selectedTables.length > 0 && (
                  <p>📍 Selected Tables: {selectedTables.sort((a, b) => a - b).join(', ')}</p>
                )}
                {selectedDate && (
                  <p>📅 Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                )}
                {selectedTimeSlot && (
                  <p>⏰ Time: {selectedTimeSlot}</p>
                )}
                {selectedTables.length > 0 && (
                  <p>🪑 Table Reservation: {selectedTables.length} table(s) × Rs.{TABLE_PRICE_PER_TABLE} = Rs.{getTableTotal()}</p>
                )}
                {selectedItems.length > 0 && (
                  <p>🍽️ Pre-Order: {selectedItems.length} items = Rs.{getOrderTotal()}</p>
                )}
                {(selectedTables.length > 0 || selectedItems.length > 0) && (
                  <p className="font-bold text-red-600 text-lg mt-2">💰 Total Amount: Rs.{getReservationGrandTotal()}</p>
                )}
              </div>
            </div>
          )}

          {/* Reserve Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReserve}
              disabled={!selectedDate || !selectedTimeSlot || selectedTables.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.phone || loading}
              className={`
                px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200
                ${(selectedDate && selectedTimeSlot && selectedTables.length > 0 && customerInfo.name && customerInfo.email && customerInfo.phone && !loading)
                  ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Processing...' : 'Reserve Now'}
            </button>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}