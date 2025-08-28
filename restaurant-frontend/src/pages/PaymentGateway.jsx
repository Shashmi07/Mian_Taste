import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createReservation } from '../services/tableReservationAPI';

import NavBar from '../components/NavBar';

export default function PaymentGateway() {
  const navigate = useNavigate();
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
    const savedOrder = localStorage.getItem('currentOrder');
    const pendingReservation = localStorage.getItem('pendingReservation');
    
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setOrderData(order);
        
        // If it's a table reservation, auto-fill customer info from database and set card payment
        if (order.type === 'table-reservation') {
          const customerUser = localStorage.getItem('customerUser');
          if (customerUser) {
            const userData = JSON.parse(customerUser);
            setCustomerInfo({
              name: userData.username || '',
              email: userData.email || '',
              phone: userData.phoneNumber || ''
            });
          }
          // Auto-select card payment for table reservations
          setPaymentMethod('card');
        } else if (order.customerName) {
          // Pre-fill customer name if available for other orders
          setCustomerInfo(prev => ({ ...prev, name: order.customerName }));
        }
      } catch (error) {
        console.error('Error loading order data:', error);
        // Redirect to cart if no valid order data
        navigate('/cart');
      }
    } else if (pendingReservation) {
      try {
        const reservation = JSON.parse(pendingReservation);
        setOrderData({
          type: 'reservation',
          total: reservation.total,
          customerName: reservation.data.customerName,
          reservationData: reservation.data,
          createdAt: reservation.createdAt
        });
        // Pre-fill customer info if available
        setCustomerInfo({
          name: reservation.data.customerName,
          email: reservation.data.customerEmail,
          phone: reservation.data.customerPhone
        });
        // Auto-select card payment for reservations
        setPaymentMethod('card');
      } catch (error) {
        console.error('Error loading reservation data:', error);
        navigate('/table-reservation');
      }
    } else {
      // No order or reservation data, redirect to cart
      navigate('/cart');
    }
  }, [navigate]);

  const orderTotal = orderData?.total || 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    // Check if it's a reservation order and user needs to login
    if (orderData?.type === 'table-reservation' || orderData?.type === 'reservation') {
      const customerToken = localStorage.getItem('customerToken');
      if (!customerToken) {
        alert('Please login first to proceed with table reservation payment.');
        navigate('/login');
        return;
      }
    }
    
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle reservation payment
      if (orderData?.type === 'table-reservation' || orderData?.type === 'reservation') {
        // For table-reservation type, check if it has food orders
        if (orderData?.type === 'table-reservation') {
          // If it has food orders, create reservation with food data
          if (orderData?.reservationDetails?.hasFood) {
            console.log('Processing table + food reservation...');
            const customerUser = localStorage.getItem('customerUser');
            
            if (!customerUser) {
              throw new Error('Customer not logged in');
            }
            
            const userData = JSON.parse(customerUser);
            console.log('Customer data:', userData);
            
            // Validate customer data
            if (!userData.username || !userData.email || !userData.phoneNumber) {
              throw new Error('Incomplete customer profile. Please update your profile with name, email, and phone number.');
            }
            
            const reservationData = {
              customerName: userData.username,
              customerEmail: userData.email,
              customerPhone: userData.phoneNumber,
              reservationDate: orderData.reservationDetails.date,
              timeSlot: orderData.reservationDetails.timeSlot,
              selectedTables: orderData.reservationDetails.tables,
              specialRequests: '',
              // Food order data
              hasFood: true,
              foodItems: orderData.reservationDetails.foodItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              foodTotal: orderData.reservationDetails.foodTotal,
              tableTotal: orderData.reservationDetails.tableAmount,
              grandTotal: orderData.reservationDetails.grandTotal
            };

            console.log('Sending reservation data:', reservationData);
            
            const response = await createReservation(reservationData);
            console.log('Reservation response:', response);
            
            if (response.success) {
              alert(`💳 Payment Successful!\n\n✅ Your table reservation with food orders has been confirmed!\n\n🙏 Thank you for your payment!\n\n📍 Please arrive at the restaurant on time for your reservation.\n\n📞 Contact us if you have any questions.`);
            } else {
              console.error('Reservation creation failed:', response);
              throw new Error(response.message || 'Failed to create reservation');
            }
          } else {
            // Table-only reservation (already created)
            console.log('Processing table-only reservation...');
            alert(`💳 Payment Successful!\n\n✅ Your table reservation has been confirmed!\n\n🙏 Thank you for your payment!\n\n📍 Please arrive at the restaurant on time for your reservation.\n\n📞 Contact us if you have any questions.`);
          }
          
          // Clear cart for table reservations (if it has food items)
          clearCart();
          
          // Clean up reservation data
          localStorage.removeItem('currentOrder');
          localStorage.removeItem('reservationContext'); // Also clean up reservation context
          
          // Navigate to home
          navigate('/');
        } else {
          // Handle old reservation format
          const reservationData = orderData.reservationData;
          
          // Create the reservation after successful payment
          const response = await createReservation(reservationData);
          
          if (response.success) {
            alert(`💳 Payment Successful!\n\n🙏 Thank you for your payment!\n\n⏳ Your table reservation is being processed and you should receive a confirmation message soon.\n\n📧 We will notify you once your reservation is confirmed by our admin team.\n\n📱 Keep an eye on your notifications for updates.`);
            
            // Clean up reservation data
            localStorage.removeItem('pendingReservation');
            
            // Navigate to home
            navigate('/');
          } else {
            throw new Error(response.message || 'Failed to submit reservation');
          }
        }
      } else {
        // Handle regular order payment
        clearCart();
        
        // Navigate to order tracking
        if (orderData?.orderId) {
          navigate(`/track-order?orderId=${orderData.orderId}`);
        } else {
          navigate('/track-order');
        }
        
        // Clean up current order from localStorage
        localStorage.removeItem('currentOrder');
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
      
      // Clear cart and reservation context on failure to avoid confusion
      if (orderData?.type === 'table-reservation' && orderData?.reservationDetails?.hasFood) {
        clearCart();
        localStorage.removeItem('reservationContext');
      }
      
      // Show more specific error messages
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message.includes('not logged in')) {
        errorMessage = 'Please login first to complete your reservation.';
      } else if (error.message.includes('no longer available')) {
        errorMessage = `⚠️ Table Unavailable!\n\n${error.message}\n\nYour cart has been cleared. Please start over with available tables.`;
      } else if (error.message.includes('already reserved')) {
        errorMessage = `⚠️ Table Conflict!\n\n${error.message}\n\nYour cart has been cleared. Please select different tables or time slots.`;
      } else if (error.message.includes('reservation')) {
        errorMessage = `Payment processed but reservation failed: ${error.message}`;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
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
              onClick={() => {
                // If backing out from table reservation with food, clear cart and reservation context
                if (orderData?.type === 'table-reservation' && orderData?.reservationDetails?.hasFood) {
                  clearCart();
                  localStorage.removeItem('reservationContext');
                  localStorage.removeItem('currentOrder');
                  navigate('/table-reservation');
                } else {
                  navigate((orderData?.type === 'table-reservation' || orderData?.type === 'reservation') ? '/table-reservation' : '/cart');
                }
              }}
              className="flex items-left text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              {(orderData?.type === 'table-reservation' || orderData?.type === 'reservation') ? 'Back to Reservation' : 'Back to Cart'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Payment</h1>
            <p className="text-gray-600 text-center mb-8">
              {(orderData?.type === 'table-reservation' || orderData?.type === 'reservation') ? 'Complete your reservation payment' : 'Complete your order payment'}
            </p>

            {/* Order Total */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h2>
              <p className="text-4xl font-bold text-red-600">Rs.{orderTotal}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              {(orderData?.type === 'table-reservation' || orderData?.type === 'reservation') ? (
                // Only card payment for reservations
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
                    <span className="text-sm text-gray-500">Required for table reservations</span>
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Customer Information
                {(orderData?.type === 'table-reservation' || orderData?.type === 'reservation') && 
                  <span className="text-sm font-normal text-gray-500 ml-2">(From your account)</span>
                }
              </h3>
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
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      (orderData?.type === 'table-reservation' || orderData?.type === 'reservation') 
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : ''
                    }`}
                    readOnly={orderData?.type === 'table-reservation' || orderData?.type === 'reservation'}
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
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      (orderData?.type === 'table-reservation' || orderData?.type === 'reservation') 
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : ''
                    }`}
                    readOnly={orderData?.type === 'table-reservation' || orderData?.type === 'reservation'}
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
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      (orderData?.type === 'table-reservation' || orderData?.type === 'reservation') 
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : ''
                    }`}
                    readOnly={orderData?.type === 'table-reservation' || orderData?.type === 'reservation'}
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
                  You can pay cash at the front table when you arrive at the restaurant.
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