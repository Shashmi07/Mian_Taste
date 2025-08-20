import React, { useState } from 'react';
import { Menu, Calendar, Clock, ShoppingBag, Truck, UtensilsCrossed, ChevronDown, Star, Plus, Minus } from 'lucide-react';
import NavBar from '../Components/NavBar';
import { Link } from 'react-router-dom';

function PreOrder() {
  const [selectedOrderType, setSelectedOrderType] = useState('dine-in');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Sample menu items
   const menuItems = [
    {
      id: 1,
      name: "Peking Duck",
      description: "Traditional roasted duck with pancakes, scallions, and hoisin sauce",
      price: 38.99,
      category: "Signature Dishes",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9
    },
    {
      id: 2,
      name: "Kung Pao Chicken",
      description: "Spicy stir-fried chicken with peanuts, vegetables, and chili peppers",
      price: 16.99,
      category: "Main Courses",
      image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7
    },
    {
      id: 3,
      name: "Sweet & Sour Pork",
      description: "Crispy pork with bell peppers, pineapple in tangy sauce",
      price: 18.99,
      category: "Main Courses",
      image: "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6
    },
    {
      id: 4,
      name: "Mapo Tofu",
      description: "Silky tofu in spicy Sichuan sauce with ground pork",
      price: 14.99,
      category: "Vegetarian",
      image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.5
    }
  ];
 

  // Time slots
  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
    '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-900 to-orange-400 text-white py-16 mt-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pre-Order Your Favorites</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Skip the wait and enjoy authentic Chinese cuisine on your schedule
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Type Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Order Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedOrderType('dine-in')}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedOrderType === 'dine-in'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Dine In</h3>
                  <p className="text-sm text-gray-600">Reserve your table and enjoy our restaurant atmosphere</p>
                </button>

                <button
                  onClick={() => setSelectedOrderType('takeaway')}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedOrderType === 'takeaway'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Takeaway</h3>
                  <p className="text-sm text-gray-600">Pick up your order at your convenience</p>
                </button>

                <button
                  onClick={() => setSelectedOrderType('delivery')}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedOrderType === 'delivery'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <Truck className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Delivery</h3>
                  <p className="text-sm text-gray-600">Get your food delivered to your doorstep</p>
                </button>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Select Time
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                    >
                      <option value="">Choose time slot</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {showMenu ? 'Hide Menu' : 'View Full Menu'}
                </button>
              </div>

              {showMenu && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-red-600">${item.price}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Type:</span>
                  <span className="font-medium capitalize">{selectedOrderType.replace('-', ' ')}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Cart Items ({getTotalItems()})</h4>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items in cart</p>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                          <p className="text-xs text-gray-500">${item.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total */}
              {cartItems.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-red-600">${getTotalPrice()}</span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <button
                disabled={!selectedDate || !selectedTime || cartItems.length === 0}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  selectedDate && selectedTime && cartItems.length > 0
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Place Pre-Order
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                You will receive a confirmation email with order details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Grand Minato Restaurant</h3>
          <p className="text-gray-400 mb-4">Authentic Chinese Cuisine Since 1985</p>
          <p className="text-gray-500">&copy; 2024 Grand Minato Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default PreOrder;