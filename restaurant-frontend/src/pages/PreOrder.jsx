import React, { useState, useEffect } from 'react';
import { Menu, Calendar, Clock, ShoppingBag, Truck, UtensilsCrossed, ChevronDown, Star, Plus, Minus } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NavBar from '../components/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import { menuAPI } from '../services/api';
import { preOrderSchema } from '../utils/validation';
import Footer from '../components/Footer.jsx';

function PreOrder() {
  const navigate = useNavigate();
  const [selectedOrderType, setSelectedOrderType] = useState('dine-in');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper function to check authentication and redirect if needed
  const requireAuth = () => {
    if (!isAuthenticated) {
      alert('Please login to place pre-orders');
      navigate('/login');
      return false;
    }
    return true;
  };

  // Helper function to save preorder context
  const savePreorderContext = () => {
    if (!requireAuth()) return false;
    
    const preorderData = {
      orderType: selectedOrderType,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
deliveryAddress: null
    };
    localStorage.setItem('preorderContext', JSON.stringify(preorderData));
    console.log('PreOrder: Context saved:', preorderData);
    return true;
  };

  // Check authentication status
  useEffect(() => {
    const customerToken = localStorage.getItem('customerToken');
    const customerUser = localStorage.getItem('customerUser');
    setIsAuthenticated(customerToken && customerUser);
  }, []);

  // Save context whenever user navigates away from preorder page
  useEffect(() => {
    // Save context when values change and are valid
    if (selectedOrderType && (selectedOrderType !== 'dine-in' || (selectedDate && selectedTime))) {
      savePreorderContext();
    }
  }, [selectedOrderType, selectedDate, selectedTime, customerInfo.address]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await menuAPI.getAllMenuItems();
        setMenuItems(response.data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to sample data if API fails
        setMenuItems([
          {
            _id: 1,
            name: "Peking Duck",
            description: "Traditional roasted duck with pancakes, scallions, and hoisin sauce",
            price: 38.99,
            category: "Signature Dishes",
            image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            _id: 2,
            name: "Kung Pao Chicken",
            description: "Spicy stir-fried chicken with peanuts, vegetables, and chili peppers",
            price: 16.99,
            category: "Main Courses",
            image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);
 

  // Time slots
  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
    '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const addToCart = (item) => {
    const itemId = item._id || item.id;
    const existingItem = cartItems.find(cartItem => cartItem._id === itemId || cartItem.id === itemId);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        (cartItem._id === itemId || cartItem.id === itemId)
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, id: itemId, _id: itemId, quantity: 1 }]);
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

  const processPayment = async () => {
    try {
      setProcessing(true);

      // Validate customer info
      if (!customerInfo.name || !customerInfo.phone) {
        alert('Please fill in your name and phone number');
        return;
      }


      // Prepare order data
      const orderData = {
        orderType: selectedOrderType,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        deliveryAddress: '',
        table: selectedOrderType === 'dine-in' ? 'Table 1' : '', // For now, auto-assign table
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: parseFloat(getTotalPrice()),
        notes: `Payment Method: ${paymentMethod}`
      };

      console.log('Submitting preorder:', orderData);

      // Submit to backend
      const response = await fetch('http://localhost:5000/api/pre-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log('Preorder response:', result);

      if (result.success) {
        alert(`✅ Pre-order placed successfully!\nOrder ID: ${result.order.orderId}\nScheduled for: ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}`);
        
        // Reset form
        setCartItems([]);
        setCustomerInfo({ name: '', email: '', phone: '', address: '' });
        setSelectedDate('');
        setSelectedTime('');
        setShowPayment(false);
      } else {
        throw new Error(result.message || 'Failed to place order');
      }

    } catch (error) {
      console.error('Payment processing error:', error);
      alert('❌ Failed to place order: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-900 to-orange-400 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pre-Order Your Favorites</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Skip the wait and enjoy authentic Chinese cuisine on your schedule
          </p>
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-red-600 bg-opacity-90 rounded-lg inline-block">
              <p className="text-lg font-semibold">⚠️ Login Required</p>
              <p className="text-sm">You must be logged in to place pre-orders</p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Login Now
              </button>
            </div>
          )}
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
                  onClick={() => {
                    if (requireAuth()) {
                      setSelectedOrderType('dine-in');
                    }
                  }}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedOrderType === 'dine-in'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Dine In</h3>
                  <p className="text-sm text-gray-600">Reserve your order and enjoy at our restaurant</p>
                </button>

                <button
                  onClick={() => {
                    if (requireAuth()) {
                      setSelectedOrderType('takeaway');
                    }
                  }}
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

              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              
              <Formik
                initialValues={{
                  customerName: customerInfo.name,
                  customerEmail: customerInfo.email,
                  customerPhone: customerInfo.phone,
                  scheduledDate: selectedDate,
                  scheduledTime: selectedTime,
                  orderType: selectedOrderType
                }}
                validationSchema={preOrderSchema}
                enableReinitialize={true}
                onSubmit={(values) => {
                  // Update state with validated values
                  setCustomerInfo({
                    name: values.customerName,
                    email: values.customerEmail,
                    phone: values.customerPhone,
                    address: customerInfo.address
                  });
                  setSelectedDate(values.scheduledDate);
                  setSelectedTime(values.scheduledTime);
                  console.log('PreOrder form validated:', values);
                }}
              >
                {({ values, setFieldValue, errors, touched }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Select Date *
                          </label>
                          <input
                            name="scheduledDate"
                            type="date"
                            value={values.scheduledDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              setFieldValue('scheduledDate', e.target.value);
                              setSelectedDate(e.target.value);
                            }}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                              errors.scheduledDate && touched.scheduledDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage name="scheduledDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="inline h-4 w-4 mr-2" />
                            Select Time *
                          </label>
                          <div className="relative">
                            <select
                              name="scheduledTime"
                              value={values.scheduledTime}
                              onChange={(e) => {
                                setFieldValue('scheduledTime', e.target.value);
                                setSelectedTime(e.target.value);
                              }}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none ${
                                errors.scheduledTime && touched.scheduledTime ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Choose time slot</option>
                              {timeSlots.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                          </div>
                          <ErrorMessage name="scheduledTime" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </Form>
                )}
              </Formik>
            </div>

            {/* Menu Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ready to Order?</h2>
              </div>
              <p className="text-gray-600">Select your order type, date, and time above, then proceed to browse our menu and add items to your pre-order.</p>
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

              {/* Proceed to Menu Button */}
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                  if (!selectedDate || !selectedTime) {
                    alert('Please select date and time before proceeding to menu');
                    return;
                  }
                  if (savePreorderContext()) {
                    navigate('/menu');
                  }
                }}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Menu
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                You will receive a confirmation email with order details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Customer Information Form with Validation */}
              <Formik
                initialValues={{
                  customerName: customerInfo.name,
                  customerEmail: customerInfo.email,
                  customerPhone: customerInfo.phone,
                  scheduledDate: selectedDate,
                  scheduledTime: selectedTime,
                  orderType: selectedOrderType
                }}
                validationSchema={preOrderSchema}
                enableReinitialize={true}
                onSubmit={(values) => {
                  // Update customer info state
                  setCustomerInfo({
                    name: values.customerName,
                    email: values.customerEmail,
                    phone: values.customerPhone,
                    address: customerInfo.address
                  });
                  console.log('Customer info validated:', values);
                }}
              >
                {({ values, setFieldValue, errors, touched }) => (
                    <Form>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <Field
                            name="customerName"
                            type="text"
                            placeholder="Enter your full name"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                              errors.customerName && touched.customerName ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage name="customerName" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <Field
                            name="customerPhone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                              errors.customerPhone && touched.customerPhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage name="customerPhone" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <Field
                            name="customerEmail"
                            type="email"
                            placeholder="Enter your email"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                              errors.customerEmail && touched.customerEmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage name="customerEmail" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                      </div>
                    </Form>
                )}
              </Formik>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Cash on Pickup</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>UPI</span>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-red-600">${getTotalPrice()}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {getTotalItems()} items • {selectedOrderType.replace('-', ' ')} • {selectedDate} at {selectedTime}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={processing || !customerInfo.name || !customerInfo.phone}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PreOrder;