import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    // Sample cart items - replace with actual cart state management
    {
      id: '1',
      name: 'Chicken Ramen',
      description: 'Rich and flavorful chicken broth with tender noodles',
      price: 1200,
      quantity: 2,
      image: '/api/placeholder/150/150',
      category: 'Ramen',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Beef Fried Rice',
      description: 'Wok-fried rice with tender beef and vegetables',
      price: 950,
      quantity: 1,
      image: '/api/placeholder/150/150',
      category: 'Rice',
      rating: 4.3
    },
    {
      id: '3',
      name: 'Coca Cola',
      description: 'Refreshing soft drink',
      price: 200,
      quantity: 2,
      image: '/api/placeholder/150/150',
      category: 'Drinks'
    }
  ]);

  const [isTableOrder, setIsTableOrder] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + tax;

  // Update quantity
  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Remove item completely
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-3 h-3 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-20 z-10 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#46923c' }}>
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-gray-600">{cartItems.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          // Empty cart state
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <button 
              onClick={() => navigate('/menu')}
              className="px-6 py-3 text-white font-semibold rounded-full transition-colors duration-300"
              style={{ backgroundColor: '#46923c' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5BC142'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#46923c'}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          
                          {/* Rating for food items */}
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {renderStars(item.rating)}
                              <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                              {(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                                <div className="flex items-center gap-1 ml-3">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-600">15-20 min</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Remove button */}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Price and Quantity Controls */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg font-bold" style={{ color: '#46923c' }}>
                          Rs. {item.price * item.quantity}
                          <span className="text-sm text-gray-500 font-normal ml-1">
                            (Rs. {item.price} each)
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            style={{ borderColor: '#46923c', color: '#46923c' }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="font-semibold text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                            style={{ backgroundColor: '#46923c' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5BC142'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#46923c'}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add more items button */}
              <button 
                onClick={() => navigate('/menu')}
                className="w-full p-4 border-2 border-dashed rounded-2xl text-gray-600 hover:border-[#46923c] hover:text-[#46923c] transition-colors"
              >
                + Add more items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Order type selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Order Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="orderType" 
                        value="dine-in"
                        checked={isTableOrder}
                        onChange={() => setIsTableOrder(true)}
                        className="mr-3"
                        style={{ accentColor: '#46923c' }}
                      />
                      <span>Dine-in (QR Code Order)</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="orderType" 
                        value="preorder"
                        checked={!isTableOrder}
                        onChange={() => setIsTableOrder(false)}
                        className="mr-3"
                        style={{ accentColor: '#46923c' }}
                      />
                      <span>Pre-order</span>
                    </label>
                  </div>
                  
                  {/* Table number input for dine-in */}
                  {isTableOrder && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
                      <input
                        type="text"
                        placeholder="e.g., Table 5"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#46923c' }}
                      />
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>Rs. {tax}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span style={{ color: '#46923c' }}>Rs. {total}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <button 
                  onClick={() => navigate('/payment')}
                  disabled={isTableOrder && !tableNumber.trim()}
                  className="w-full py-4 text-white font-bold rounded-full transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{ backgroundColor: isTableOrder && !tableNumber.trim() ? '#9ca3af' : '#46923c' }}
                  onMouseEnter={(e) => {
                    if (!(isTableOrder && !tableNumber.trim())) {
                      e.target.style.backgroundColor = '#5BC142';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(isTableOrder && !tableNumber.trim())) {
                      e.target.style.backgroundColor = '#46923c';
                    }
                  }}
                >
                  Proceed to Payment
                </button>

                {/* Estimated time */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#46923c' }}>
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Estimated time: 25-30 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;