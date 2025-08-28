import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Clock, Star, QrCode, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal, tax, total, updateQuantity, removeFromCart } = useCart();

  const [isTableOrder, setIsTableOrder] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isQROrder, setIsQROrder] = useState(false);
  
  // Reservation context
  const [reservationContext, setReservationContext] = useState(null);
  const [isReservationOrder, setIsReservationOrder] = useState(false);
  
  // Check for QR order and auto-fill table number
  useEffect(() => {
    const qrTable = localStorage.getItem('qrTableNumber');
    if (qrTable) {
      setIsQROrder(true);
      setIsTableOrder(true);
      setTableNumber(qrTable);
      setCustomerName('Table ' + qrTable + ' Guest');
    }
    
    // Check for reservation context
    const storedReservationContext = localStorage.getItem('reservationContext');
    if (storedReservationContext) {
      try {
        const context = JSON.parse(storedReservationContext);
        setReservationContext(context);
        setIsReservationOrder(true);
        setIsTableOrder(true);
        setTableNumber(context.tableDetails.tables.join(', '));
        setCustomerName(context.customerName);
        console.log('Cart: Reservation context found:', context);
      } catch (error) {
        console.error('Cart: Error parsing reservation context:', error);
        localStorage.removeItem('reservationContext');
      }
    }
  }, []);

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

  // Handle order creation
  const handleCreateOrder = async () => {
    if (cartItems.length === 0) return;
    
    // Validation
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (isTableOrder && !tableNumber.trim()) {
      alert('Please enter table number for dine-in orders');
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Validate cart items before creating order
      console.log('Cart items before validation:', cartItems);
      const validItems = cartItems.filter(item => {
        const isValid = item.name && item.quantity > 0 && item.price;
        if (!isValid) {
          console.warn('Invalid cart item:', item);
        }
        return isValid;
      });

      if (validItems.length === 0) {
        throw new Error('No valid items in cart');
      }

      // Prepare order data according to the backend model
      const orderData = {
        table: isTableOrder ? tableNumber.trim() : 'Pre-order',
        customerName: customerName.trim(),
        items: validItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
        })),
        totalAmount: total,
        notes: isTableOrder ? `Dine-in order for ${tableNumber}` : 'Pre-order for pickup'
      };

      console.log('Creating order with data:', orderData);
      console.log('API URL being used:', 'http://10.11.5.232:5000/api/orders/public');

      // Create order
      const response = await ordersAPI.createOrder(orderData);
      console.log('API response:', response);
      
      if (response.data && response.data.success) {
        const order = response.data.order;
        console.log('Order created successfully:', order);
        
        // Store order info for payment page
        const orderForPayment = {
          orderId: order.orderId || order._id,
          orderNumber: order._id,
          total: total,
          items: cartItems,
          customerName: customerName,
          table: isTableOrder ? tableNumber : 'Pre-order',
          createdAt: new Date().toISOString()
        };
        
        // If it's a reservation order, add reservation-specific data
        if (isReservationOrder && reservationContext) {
          orderForPayment.type = 'table-reservation';
          orderForPayment.orderType = 'Table Reservation';
          orderForPayment.reservationDetails = {
            reservationId: reservationContext.reservationId,
            tables: reservationContext.tableDetails.tables,
            date: reservationContext.tableDetails.date,
            timeSlot: reservationContext.tableDetails.timeSlot,
            tableAmount: reservationContext.tableAmount,
            // Add food order data for table+food reservations
            hasFood: true,
            foodItems: cartItems,
            foodTotal: total,
            grandTotal: total + reservationContext.tableAmount
          };
          // Update total to include table reservation cost
          orderForPayment.total = total + reservationContext.tableAmount;
        }
        
        localStorage.setItem('currentOrder', JSON.stringify(orderForPayment));

        // Navigate to payment
        navigate('/payment');
      } else if (response.data) {
        // Handle case where API returns data but no success flag
        const order = response.data;
        console.log('Order created (no success flag):', order);
        
        const orderForPayment = {
          orderId: order.orderId || order._id,
          orderNumber: order._id,
          total: total,
          items: cartItems,
          customerName: customerName,
          table: isTableOrder ? tableNumber : 'Pre-order',
          createdAt: new Date().toISOString()
        };
        
        // If it's a reservation order, add reservation-specific data
        if (isReservationOrder && reservationContext) {
          orderForPayment.type = 'table-reservation';
          orderForPayment.orderType = 'Table Reservation';
          orderForPayment.reservationDetails = {
            reservationId: reservationContext.reservationId,
            tables: reservationContext.tableDetails.tables,
            date: reservationContext.tableDetails.date,
            timeSlot: reservationContext.tableDetails.timeSlot,
            tableAmount: reservationContext.tableAmount,
            // Add food order data for table+food reservations
            hasFood: true,
            foodItems: cartItems,
            foodTotal: total,
            grandTotal: total + reservationContext.tableAmount
          };
          // Update total to include table reservation cost
          orderForPayment.total = total + reservationContext.tableAmount;
        }
        
        localStorage.setItem('currentOrder', JSON.stringify(orderForPayment));

        navigate('/payment');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to create order. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg sticky top-0 z-10 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-red-800 hover:bg-opacity-30 transition-colors text-red-100 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 text-red-100" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-600">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">Your Cart</h1>
                  {isQROrder && (
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <QrCode className="w-4 h-4" />
                      Table {tableNumber}
                    </div>
                  )}
                  {isReservationOrder && (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Reservation Order
                    </div>
                  )}
                </div>
                <p className="text-red-100">{cartItems.length} items</p>
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
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
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
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Price and Quantity Controls */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg font-bold" style={{ color: '#dc2626' }}>
                          Rs. {item.price * item.quantity}
                          <span className="text-sm text-gray-500 font-normal ml-1">
                            (Rs. {item.price} each)
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            style={{ borderColor: '#dc2626', color: '#dc2626' }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="font-semibold text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                            style={{ backgroundColor: '#dc2626' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
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
                className="w-full p-4 border-2 border-dashed rounded-2xl text-gray-600 hover:border-red-600 hover:text-red-600 transition-colors"
              >
                + Add more items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Reservation Details */}
                {isReservationOrder && reservationContext && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Table Reservation Details
                    </h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><span className="font-medium">Reservation ID:</span> {reservationContext.reservationId}</p>
                      <p><span className="font-medium">Date:</span> {reservationContext.tableDetails.date}</p>
                      <p><span className="font-medium">Time:</span> {reservationContext.tableDetails.timeSlot}</p>
                      <p><span className="font-medium">Tables:</span> {reservationContext.tableDetails.tables.join(', ')}</p>
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Table Reservation:</span>
                          <span className="font-semibold">Rs. {reservationContext.tableAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Customer Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name * 
                    {isQROrder && <span className="text-sm text-red-600 font-normal">(QR Order)</span>}
                    {isReservationOrder && <span className="text-sm text-blue-600 font-normal">(Reservation Order)</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={isQROrder ? "Table Guest (auto-filled)" : "Enter your name"}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${isQROrder ? 'bg-green-50' : ''}`}
                    style={{ '--tw-ring-color': '#46923c' }}
                    required
                  />
                  {isQROrder && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✅ Auto-filled for QR table order. You can edit if needed.
                    </p>
                  )}
                </div>

                {/* Order type selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order Type
                    {isQROrder && <span className="text-sm text-red-600 font-normal">(Auto-selected)</span>}
                    {isReservationOrder && <span className="text-sm text-blue-600 font-normal">(Auto-selected)</span>}
                  </label>
                  
                  {isReservationOrder ? (
                    // Reservation order - show only table reservation option
                    <div className="space-y-2">
                      <label className="flex items-center opacity-75">
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="table-reservation"
                          checked={true}
                          disabled={true}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Table Reservation</span>
                        <span className="ml-2 text-blue-600">✓</span>
                      </label>
                    </div>
                  ) : (
                    // Regular QR or manual order - show original options
                    <div className="space-y-2">
                      <label className={`flex items-center ${isQROrder ? 'opacity-75' : ''}`}>
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="dine-in"
                          checked={isTableOrder}
                          onChange={() => !isQROrder && setIsTableOrder(true)}
                          disabled={isQROrder}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Dine-in (QR Code Order)</span>
                        {isQROrder && <span className="ml-2 text-green-600">✓</span>}
                      </label>
                      <label className={`flex items-center ${isQROrder ? 'opacity-50' : ''}`}>
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="preorder"
                          checked={!isTableOrder}
                          onChange={() => !isQROrder && setIsTableOrder(false)}
                          disabled={isQROrder}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Pre-order</span>
                      </label>
                    </div>
                  )}
                  
                  {/* Table number input for dine-in */}
                  {isTableOrder && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Table Number *
                        {isQROrder && <span className="text-sm text-red-600 font-normal">(QR Detected)</span>}
                        {isReservationOrder && <span className="text-sm text-blue-600 font-normal">(From Reservation)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          isQROrder ? "Table detected from QR" : 
                          isReservationOrder ? "Tables from reservation" : 
                          "e.g., Table 5"
                        }
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                          isQROrder ? 'bg-green-50' : 
                          isReservationOrder ? 'bg-blue-50' : ''
                        }`}
                        style={{ '--tw-ring-color': '#dc2626' }}
                        readOnly={isQROrder || isReservationOrder}
                        required
                      />
                      {isQROrder && (
                        <p className="text-xs text-gray-500 mt-1">
                          ✅ Table detected from QR code scan.
                        </p>
                      )}
                      {isReservationOrder && (
                        <p className="text-xs text-gray-500 mt-1">
                          ✅ Tables auto-filled from your table reservation.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Food Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  {isReservationOrder && reservationContext && (
                    <div className="flex justify-between text-gray-600">
                      <span>Table Reservation</span>
                      <span>Rs. {reservationContext.tableAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>Rs. {tax}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span style={{ color: '#dc2626' }}>
                      Rs. {isReservationOrder && reservationContext ? total + reservationContext.tableAmount : total}
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button 
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !customerName.trim() || (isTableOrder && !tableNumber.trim())}
                  className="w-full py-4 text-white font-bold rounded-full transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: (isCreatingOrder || !customerName.trim() || (isTableOrder && !tableNumber.trim())) ? '#9ca3af' : '#dc2626' 
                  }}
                  onMouseEnter={(e) => {
                    if (!(isCreatingOrder || !customerName.trim() || (isTableOrder && !tableNumber.trim()))) {
                      e.target.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(isCreatingOrder || !customerName.trim() || (isTableOrder && !tableNumber.trim()))) {
                      e.target.style.backgroundColor = '#dc2626';
                    }
                  }}
                >
                  {isCreatingOrder ? 'Creating Order...' : 'Create Order & Proceed to Payment'}
                </button>

                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;