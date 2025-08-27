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
        // Pre-fill customer name if available
        if (order.customerName) {
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
      if (orderData?.type === 'reservation') {
        const reservationData = orderData.reservationData;
        
        // Create the reservation after successful payment
        const response = await createReservation(reservationData);
        
        if (response.success) {
          const tableNumbers = reservationData.selectedTables.sort((a, b) => a - b).join(', ');
          const tableCostInfo = `\nTable Reservation: ${reservationData.selectedTables.length} table(s) × Rs.${reservationData.tableCost.pricePerTable} = Rs.${reservationData.tableCost.totalTableCost}`;
          const orderInfo = reservationData.preOrder && reservationData.preOrder.items.length > 0
            ? `\nPre-Order: ${reservationData.preOrder.items.length} items = Rs.${reservationData.preOrder.totalAmount}` 
            : '\nPre-Order: No items selected';
          const totalInfo = `\nTOTAL PAID: Rs.${orderTotal}`;
          alert(`🎉 Reservation Confirmed & Payment Successful!${tableCostInfo}${orderInfo}${totalInfo}\n\n📋 Details:\nReservation ID: ${response.reservation.reservationId}\nTables: ${tableNumbers}\nDate: ${reservationData.reservationDate}\nTime: ${reservationData.timeSlot}\n\n💡 Please save your reservation ID for future reference.`);
          
          // Clean up reservation data
          localStorage.removeItem('pendingReservation');
          
          // Navigate to home
          navigate('/');
        } else {
          throw new Error(response.message || 'Failed to create reservation');
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
              {orderData?.type === 'reservation' ? (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                      paymentMethod === 'paypal' 
                        ? 'border-red-500 bg-red-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-3"></div>
                    <span className="block font-semibold text-gray-800">PayPal</span>
                    <span className="text-sm text-gray-500">Pay with PayPal</span>
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
                  You can pay cash at the front table when you arrive at the restaurant.
                </p>
                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    💡 Please have exact change ready: <span className="font-bold">Rs.{orderTotal}</span>
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">PayPal Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@paypal.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                      <span className="font-semibold text-blue-800">PayPal Payment</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
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