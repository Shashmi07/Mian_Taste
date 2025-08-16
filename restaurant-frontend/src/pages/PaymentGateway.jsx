import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowLeft, Lock } from 'lucide-react';

import NavBar from '../components/NavBar'; // Adjust the import path as necessary

export default function PaymentGateway() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const orderTotal = 5310; // Changed from 53.10 to 5310 (Rs format)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }
    
    alert(`Payment of Rs.${orderTotal} will be processed via ${paymentMethod.toUpperCase()}. Thank you!`);
  };

  return (
    <div className="min-h-screen bg-slate-300">
      <NavBar />
      <div className="pt-24 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <button className="flex items-left text-gray-700 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Cart
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Payment</h1>
            <p className="text-gray-600 text-center mb-8">Complete your order payment</p>

            {/* Order Total */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h2>
              <p className="text-4xl font-bold text-green-600">Rs.{orderTotal}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                    paymentMethod === 'card' 
                      ? 'border-green-500 bg-green-50 shadow-md' 
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
                      ? 'border-green-500 bg-green-50 shadow-md' 
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
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-3"></div>
                  <span className="block font-semibold text-gray-800">PayPal</span>
                  <span className="text-sm text-gray-500">Pay with PayPal</span>
                </button>
              </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              disabled={!paymentMethod}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                paymentMethod
                  ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white`}
            >
              {paymentMethod === 'card' && `Pay Rs.${orderTotal} with Card`}
              {paymentMethod === 'cash' && 'Confirm Cash Payment'}
              {paymentMethod === 'paypal' && `Pay Rs.${orderTotal} with PayPal`}
              {!paymentMethod && `Complete Payment - Rs.${orderTotal}`}
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