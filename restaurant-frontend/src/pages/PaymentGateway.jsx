import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createReservation } from '../services/tableReservationAPI';

import NavBar from '../components/NavBar';

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load order data or reservation data from localStorage
  useEffect(() => {
    console.log('🔍 PaymentGateway: Component mounted, loading data...');
    
    const loadData = () => {
      console.log('🔍 PaymentGateway: Loading order/reservation data...');
      
      // Reset state first to ensure clean load
      setOrderData(null);
      setCustomerInfo({ name: '', email: '', phone: '' });
      setPaymentMethod('');
      
      const savedOrder = localStorage.getItem('currentOrder');
      const pendingReservation = localStorage.getItem('pendingReservation');
      const customerUser = localStorage.getItem('customerUser');
      
      console.log('🔍 PaymentGateway: Found savedOrder:', !!savedOrder);
      console.log('🔍 PaymentGateway: Found pendingReservation:', !!pendingReservation);
      console.log('🔍 PaymentGateway: Found customerUser:', !!customerUser);
      
      if (pendingReservation) {
        console.log('🔍 PaymentGateway: PendingReservation raw data:', pendingReservation);
      }
      
      if (customerUser) {
        console.log('🔍 PaymentGateway: CustomerUser raw data:', customerUser);
      }

      // For table+food reservations, prioritize savedOrder (cart data with food items) over pendingReservation
      if (savedOrder && pendingReservation) {
        try {
          const order = JSON.parse(savedOrder);
          const reservation = JSON.parse(pendingReservation);
          
          console.log('🔍 PaymentGateway: Found both savedOrder and pendingReservation');
          console.log('🔍 SavedOrder type:', order.type);
          console.log('🔍 PendingReservation type:', reservation.type);
          
          // If both exist and pending reservation is table-food, use savedOrder (cart data) as it has food items
          if (reservation.type === 'table-food' && order.items && order.items.length > 0) {
            console.log('🔍 Using savedOrder for table+food as it has food items');
            setOrderData(order);
            
            // Pre-fill customer info
            const customerData = {
              name: order.customerName || '',
              email: order.customerEmail || '',
              phone: order.customerPhone || ''
            };
            
            // Enhance with stored customer data
            try {
              const storedUser = localStorage.getItem('customerUser');
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                customerData.name = customerData.name || userData.username || userData.name || '';
                customerData.email = customerData.email || userData.email || '';
                customerData.phone = customerData.phone || userData.phoneNumber || userData.phone || '';
              }
            } catch (error) {
              console.warn('Could not parse stored customer data:', error);
            }
            
            setCustomerInfo(customerData);
            setPaymentMethod('card');
            return; // Exit early, don't process pendingReservation
          }
        } catch (error) {
          console.error('Error checking savedOrder vs pendingReservation:', error);
        }
      }

      if (pendingReservation) {
        try {
          const reservation = JSON.parse(pendingReservation);
          console.log('🔍 PaymentGateway: Loading pending reservation:', reservation);
          
          // Handle different reservation structures: table-only vs table-food
          const reservationData = reservation.data || reservation; // table-food has .data, table-only doesn't
          console.log('🔍 PaymentGateway: Extracted reservationData:', reservationData);
          
          setOrderData({
            type: reservation.type || 'reservation', // Preserve original type (table-only, table-food, etc.)
            total: reservation.total,
            customerName: reservationData.customerName,
            reservationData: reservationData,
            createdAt: reservation.createdAt
          });
          console.log('🔍 PaymentGateway: Set orderData for reservation');
          
          // Pre-fill customer info if available from reservation data
          const customerData = {
            name: reservationData.customerName || '',
            email: reservationData.customerEmail || '',
            phone: reservationData.customerPhone || ''
          };
          
          console.log('🔍 PaymentGateway: Initial customer data from reservation:', customerData);
          
          // Fetch fresh customer data from customer-dashboard database
          try {
            const storedUser = localStorage.getItem('customerUser');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              console.log('🔍 PaymentGateway: Found stored customer data from customer-dashboard:', userData);
              
              // Use customer-dashboard data structure: username, email, phoneNumber, address
              console.log('🔍 PaymentGateway: Before merge - customerData:', customerData);
              console.log('🔍 PaymentGateway: userData fields - username:', userData.username, 'email:', userData.email, 'phoneNumber:', userData.phoneNumber);
              
              customerData.name = customerData.name || userData.username || userData.name || '';
              customerData.email = customerData.email || userData.email || '';
              customerData.phone = customerData.phone || userData.phoneNumber || userData.phone || '';
              
              console.log('🔍 PaymentGateway: After merge - customerData:', customerData);
              console.log('🔍 PaymentGateway: Final extracted customer data:', {
                name: customerData.name,
                email: customerData.email, 
                phone: customerData.phone,
                address: userData.address
              });
            } else {
              console.log('🔍 PaymentGateway: No stored customer data found');
            }
          } catch (error) {
            console.warn('🔍 Could not parse stored customer data from customer-dashboard:', error);
          }
          
          console.log('🔍 PaymentGateway: Final customer data being set to state:', customerData);
          setCustomerInfo(customerData);
          console.log('🔍 PaymentGateway: setCustomerInfo called with:', customerData);
          // Auto-select card payment for ALL reservations
          setPaymentMethod('card');
        } catch (error) {
          console.error('Error loading reservation data:', error);
          navigate('/table-reservation');
        }
      } else if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder);
          console.log('🔍 PaymentGateway: Loading saved order:', order);
          setOrderData(order);
          
          // Pre-fill customer info from order and customer-dashboard
          const customerData = {
            name: order.customerName || '',
            email: order.customerEmail || '',
            phone: order.customerPhone || ''
          };
          
          console.log('🔍 PaymentGateway: Initial customer data from saved order:', customerData);
          
          // Fetch customer data from customer-dashboard database  
          try {
            const storedUser = localStorage.getItem('customerUser');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              console.log('🔍 PaymentGateway: Found stored customer data from customer-dashboard for order:', userData);
              
              // Use customer-dashboard data structure: username, email, phoneNumber
              console.log('🔍 PaymentGateway: Before merge for order - customerData:', customerData);
              console.log('🔍 PaymentGateway: userData fields for order - username:', userData.username, 'email:', userData.email, 'phoneNumber:', userData.phoneNumber);
              
              customerData.name = customerData.name || userData.username || userData.name || '';
              customerData.email = customerData.email || userData.email || '';
              customerData.phone = customerData.phone || userData.phoneNumber || userData.phone || '';
              
              console.log('🔍 PaymentGateway: After merge for order - customerData:', customerData);
            } else {
              console.log('🔍 PaymentGateway: No stored customer data found for order');
            }
          } catch (error) {
            console.warn('🔍 Could not parse stored customer data from customer-dashboard for order:', error);
          }
          
          console.log('🔍 PaymentGateway: Final customer data being set to state for order:', customerData);
          setCustomerInfo(customerData);
          console.log('🔍 PaymentGateway: setCustomerInfo called for order with:', customerData);
        } catch (error) {
          console.error('Error loading order data:', error);
          // Redirect to cart if no valid order data
          navigate('/cart');
        }
      } else {
        // No order or reservation data, redirect to cart
        navigate('/cart');
      }
    };
    
    // Call loadData immediately
    loadData();
    
  }, [navigate, location.pathname]);

  const orderTotal = orderData?.total || 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }
    
    // Prevent multiple simultaneous payment processing
    if (isProcessing) {
      console.log('🔍 Payment already in progress, ignoring duplicate request');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log('🔍 Starting payment processing for orderData:', orderData);
      console.log('🔍 OrderData type:', orderData?.type);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle table-only reservation payment
      if (orderData?.type === 'reservation') {
        console.log('🔍 Processing reservation type payment');
        const originalReservationData = orderData.reservationData;
        
        console.log('🔍 Original reservation data:', originalReservationData);
        
        // Transform data to match backend expectations
        const reservationData = {
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          reservationDate: originalReservationData.selectedDate || originalReservationData.reservationDate,
          timeSlot: originalReservationData.selectedTimeSlot || originalReservationData.timeSlot,
          selectedTables: originalReservationData.selectedTables,
          specialRequests: originalReservationData.specialRequests || '',
          hasFood: false, // table-only reservation
          foodItems: [],
          foodTotal: 0,
          tableTotal: originalReservationData.tableTotal || originalReservationData.total || orderData.total,
          grandTotal: originalReservationData.tableTotal || originalReservationData.total || orderData.total
        };
        
        console.log('🔍 Transformed reservation data for backend:', reservationData);
        
        // Create the reservation after successful payment
        const response = await createReservation(reservationData);
        
        if (response.success) {
          console.log('🔍 Table-only reservation success handler');
          const tableNumbers = reservationData.selectedTables.sort((a, b) => a - b).join(', ');
          const tableCostInfo = `\nTable Reservation: ${reservationData.selectedTables.length} table(s) × Rs.500 = Rs.${reservationData.tableTotal}`;
          const totalInfo = `\nTOTAL PAID: Rs.${reservationData.tableTotal}`;
          alert(`🎉 Table Reservation Confirmed & Payment Successful!${tableCostInfo}${totalInfo}\n\n📋 Details:\nReservation ID: ${response.reservation.reservationId}\nTables: ${tableNumbers}\nDate: ${reservationData.reservationDate}\nTime: ${reservationData.timeSlot}\n\n💡 Please save your reservation ID for future reference.`);
          
          // Clean up ALL reservation and cart data to prevent conflicts
          localStorage.removeItem('pendingReservation');
          localStorage.removeItem('reservationContext');
          localStorage.removeItem('orderData');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('reservationState');
          localStorage.removeItem('returnAfterLogin');
          clearCart(); // Clear cart context after successful table-only reservation
          
          console.log('🧹 Cleared all reservation and cart data after successful payment');
          
          // Navigate to home
          navigate('/');
        } else {
          throw new Error(response.message || 'Failed to create reservation');
        }
      } 
      // Handle table+food reservation payment
      else if (orderData?.type === 'table-food') {
        console.log('🔍 Processing table-food reservation:', orderData);
        
        // For table+food, get reservation data from orderData.reservationData (which comes from pendingReservation)
        const reservationData = orderData.reservationData || orderData.data;
        
        // Get food items - check multiple sources
        let foodItems = [];
        let foodTotal = 0;
        
        console.log('🔍 Checking for food items in orderData.items:', orderData.items);
        console.log('🔍 Checking reservationData:', reservationData);
        console.log('🔍 Checking for food items in reservationData.preOrder:', reservationData?.preOrder);
        if (orderData.items && orderData.items.length > 0) {
          // Food items from cart/order data (most reliable)
          console.log('🔍 Using food items from orderData.items');
          console.log('🔍 Raw food items:', orderData.items);
          foodItems = orderData.items.map(item => {
            const quantity = item.quantity || item.count || 1; // Handle missing quantity
            const price = typeof item.price === 'number' ? item.price : parseInt(item.price) || 0;
            console.log(`🔍 Processing item: ${item.name}, quantity: ${quantity}, price: ${price}`);
            return {
              name: item.name,
              quantity: quantity,
              price: price
            };
          });
          // Calculate food total from items
          foodTotal = foodItems.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            console.log(`🔍 Item total for ${item.name}: ${item.price} x ${item.quantity} = ${itemTotal}`);
            return total + itemTotal;
          }, 0);
          console.log('🔍 Calculated food total:', foodTotal);
        } else if (reservationData.preOrder?.items && reservationData.preOrder.items.length > 0) {
          // Food items from preOrder
          console.log('🔍 Using food items from preOrder');
          foodItems = reservationData.preOrder.items;
          foodTotal = reservationData.preOrder.totalAmount || 0;
        } else {
          console.log('❌ NO FOOD ITEMS FOUND - this should not happen for table+food reservations');
        }
        
        // Get table total - check multiple sources for cart-based orders
        let tableTotal = 0;
        if (orderData.reservationDetails?.tableAmount) {
          tableTotal = orderData.reservationDetails.tableAmount;
        } else if (reservationData.tableCost?.totalTableCost) {
          tableTotal = reservationData.tableCost.totalTableCost;
        }
        
        // Calculate totals
        const grandTotal = tableTotal + foodTotal;
        
        console.log('🔍 Food items found:', foodItems.length, 'items');
        console.log('🔍 Table total:', tableTotal, 'Food total:', foodTotal, 'Grand total:', grandTotal);
        console.log('🔍 Reservation details:', orderData.reservationDetails);
        
        // Extract reservation details from the correct source
        const reservationDetails = orderData.reservationDetails || reservationData;
        
        // Prepare reservation data for backend
        const backendReservationData = {
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          reservationDate: reservationDetails.date || reservationDetails.reservationDate,
          timeSlot: reservationDetails.timeSlot,
          selectedTables: reservationDetails.tables || reservationDetails.selectedTables,
          specialRequests: reservationDetails.specialRequests || '',
          hasFood: true,
          foodItems: foodItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
          })),
          foodTotal: foodTotal,
          tableTotal: tableTotal,
          grandTotal: grandTotal
        };
        
        console.log('🔍 Final reservation data being sent to backend:', backendReservationData);
        
        // Create the reservation after successful payment
        console.log('🔍 Calling createReservation API...');
        try {
          const response = await createReservation(backendReservationData);
          console.log('🔍 API Response:', response);
          
          if (response.success) {
          console.log('🔍 Table+food success handler - FIXED VERSION');
          
          // Create clean reservationData object (like table-only does)
          const cleanReservationData = {
            selectedTables: reservationDetails.tables || reservationDetails.selectedTables || [],
            reservationDate: reservationDetails.date || reservationDetails.reservationDate,
            timeSlot: reservationDetails.timeSlot,
            tableTotal: tableTotal,
            foodTotal: foodTotal,
            grandTotal: grandTotal,
            foodItems: foodItems
          };
          
          const tableNumbers = cleanReservationData.selectedTables.sort((a, b) => a - b).join(', ');
          const tableCostInfo = `\nTable Reservation: ${cleanReservationData.selectedTables.length} table(s) × Rs.500 = Rs.${cleanReservationData.tableTotal}`;
          const foodInfo = `\nFood Order: ${cleanReservationData.foodItems.length} items = Rs.${cleanReservationData.foodTotal}`;
          const totalInfo = `\nTOTAL PAID: Rs.${cleanReservationData.grandTotal}`;
          alert(`🎉 Table + Food Reservation Confirmed & Payment Successful!${tableCostInfo}${foodInfo}${totalInfo}\n\n📋 Details:\nReservation ID: ${response.reservation.reservationId}\nTables: ${tableNumbers}\nDate: ${cleanReservationData.reservationDate}\nTime: ${cleanReservationData.timeSlot}\n\n💡 Please save your reservation ID for future reference.`);
          
          // Clean up ALL reservation and cart data to prevent conflicts
          localStorage.removeItem('pendingReservation');
          localStorage.removeItem('reservationContext'); 
          localStorage.removeItem('orderData');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('reservationState');
          localStorage.removeItem('returnAfterLogin');
          clearCart(); // Clear cart context after successful table+food reservation
          
          console.log('🧹 Cleared all reservation and cart data after successful payment');
          
          // Navigate to home
          navigate('/');
        } else {
          throw new Error(response.message || 'Failed to create reservation');
        }
        } catch (error) {
          console.error('❌ Error creating table+food reservation:', error);
          alert(`❌ Payment Failed: ${error.message || 'Unknown error occurred'}`);
          return;
        }
      } else if (orderData?.type === 'table-reservation') {
        // Handle table reservation payment (from TableReservation.jsx)
        console.log('🎉 Processing table-reservation payment');
        
        // Extract data directly from orderData (since the structure comes from table-only reservations)
        console.log('🔍 OrderData structure for table-reservation:', orderData);
        
        // Prepare reservation data for backend with correct field names
        const reservationData = {
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          reservationDate: orderData.selectedDate, // Backend expects reservationDate
          timeSlot: orderData.selectedTimeSlot,     // Backend expects timeSlot
          selectedTables: orderData.selectedTables,
          specialRequests: orderData.specialRequests || '',
          hasFood: false, // table-only reservation
          foodItems: [],
          foodTotal: 0,
          tableTotal: orderData.tableTotal || orderData.total,
          grandTotal: orderData.tableTotal || orderData.total
        };
        
        console.log('🔍 Creating table reservation with data:', reservationData);
        
        // Create the reservation after successful payment
        const response = await createReservation(reservationData);
        
        if (response.success) {
          const tableNumbers = orderData.selectedTables.sort((a, b) => a - b).join(', ');
          const tableCostInfo = `\nTable Reservation: ${orderData.selectedTables.length} table(s) × Rs.500 = Rs.${orderData.tableTotal || orderData.total}`;
          const totalInfo = `\nTOTAL PAID: Rs.${orderData.tableTotal || orderData.total}`;
          
          alert(`🎉 Table Reservation Confirmed & Payment Successful!${tableCostInfo}${totalInfo}\n\n📋 Details:\nReservation ID: ${response.reservation.reservationId}\nTables: ${tableNumbers}\nDate: ${orderData.selectedDate}\nTime: ${orderData.selectedTimeSlot}\n\n💡 Please save your reservation ID for future reference.`);
          
          // Clean up ALL reservation and cart data to prevent conflicts
          localStorage.removeItem('currentOrder');
          localStorage.removeItem('pendingReservation');
          localStorage.removeItem('reservationContext');
          localStorage.removeItem('orderData');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('reservationState');
          localStorage.removeItem('returnAfterLogin');
          clearCart(); // Clear cart context after successful table reservation
          
          console.log('🧹 Cleared all reservation and cart data after successful payment');
          
          // Navigate to home
          navigate('/');
        } else {
          throw new Error(response.message || 'Failed to create reservation');
        }
      } else {
        // Handle regular food order payment
        // Clean up ALL reservation and cart data to prevent conflicts
        localStorage.removeItem('currentOrder');
        localStorage.removeItem('pendingReservation');
        localStorage.removeItem('reservationContext');
        localStorage.removeItem('orderData');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('reservationState');
        localStorage.removeItem('returnAfterLogin');
        clearCart(); // Clear cart context after successful regular order
        
        console.log('🧹 Cleared all reservation and cart data after successful payment');
        
        // Navigate to order tracking
        if (orderData?.orderId) {
          navigate(`/track-order?orderId=${orderData.orderId}`);
        } else {
          navigate('/track-order');
        }
      }
      
      // Store payment info for confirmation
      localStorage.setItem('paymentInfo', JSON.stringify({
        method: paymentMethod,
        amount: orderTotal,
        customerInfo: customerInfo,
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300">
      <NavBar />
      <div className="pt-24 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(orderData?.type === 'reservation' ? '/table-reservation' : '/cart')}
              className="flex items-left text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              {orderData?.type === 'reservation' ? 'Back to Reservation' : 'Back to Cart'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Payment</h1>
            <p className="text-gray-600 text-center mb-8">
              {orderData?.type === 'reservation' ? 'Complete your reservation payment' : 'Complete your order payment'}
            </p>

            {/* Order Total */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h2>
              <p className="text-4xl font-bold text-red-600">Rs.{orderTotal}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              {(orderData?.type === 'reservation' || orderData?.type === 'table-reservation' || orderData?.type === 'table-only' || orderData?.type === 'table-food') ? (
                // Only card payment for ALL table reservations
                <div className="flex justify-center">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                      paymentMethod === 'card' 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={32} className="mx-auto mb-3 text-gray-600" />
                    <span className="block font-semibold text-gray-800">Credit/Debit Card</span>
                    <span className="text-sm text-gray-500">Required for all table reservations</span>
                  </button>
                </div>
              ) : (
                // All payment methods for regular orders
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                      paymentMethod === 'card' 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={32} className="mx-auto mb-3 text-gray-600" />
                    <span className="block font-semibold text-gray-800">Credit/Debit Card</span>
                    <span className="text-sm text-gray-500">Pay with card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                      paymentMethod === 'cash' 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign size={32} className="mx-auto mb-3 text-gray-600" />
                    <span className="block font-semibold text-gray-800">Cash</span>
                    <span className="text-sm text-gray-500">Pay on delivery</span>
                  </button>

                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Specific Forms */}
            {paymentMethod === 'card' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Card Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard size={16} className="inline mr-1" />
                      Card Number *
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-yellow-50 rounded-lg p-6 mb-8 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={32} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Cash Payment</h4>
                <p className="text-yellow-700 mb-4">
                  You can pay cash at the front table 
                </p>
                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    💡 Please have exact change ready: <span className="font-bold">Rs.{orderTotal}</span>
                  </p>
                </div>
              </div>
            )}

            
            {/* Security Notice */}
            <div className="flex items-center justify-center mb-6 text-gray-600">
              <Lock size={16} className="mr-2" />
              <span className="text-sm">Your payment information is secure and encrypted</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                paymentMethod && !isProcessing
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                <>
                  {paymentMethod === 'card' && `Pay Rs.${orderTotal} with Card`}
                  {paymentMethod === 'cash' && 'Confirm Cash Payment'}
                  {paymentMethod === 'paypal' && `Pay Rs.${orderTotal} with PayPal`}
                  {!paymentMethod && `Complete Payment - Rs.${orderTotal}`}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing your purchase you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}