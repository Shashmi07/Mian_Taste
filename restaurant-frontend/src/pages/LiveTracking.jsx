import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Package, Timer, RefreshCw, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket';

const LiveTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (order && isTracking) {
      // Connect to socket for real-time updates
      socketService.connect();
      if (socketService.socket) {
        // Join order-specific room for updates
        socketService.socket.emit('join-order-tracking', order._id);
        
        // Listen for order status updates
        socketService.socket.on('order-updated', (updatedOrder) => {
          console.log('Real-time order update received:', updatedOrder);
          if (updatedOrder._id === order._id) {
            setOrder(updatedOrder);
          }
        });

        socketService.socket.on('order-status-changed', (data) => {
          console.log('Order status changed:', data);
          if (data.orderId === order._id) {
            setOrder(prev => ({
              ...prev,
              status: data.status,
              cookingStatus: data.cookingStatus
            }));
          }
        });
      }

      return () => {
        if (socketService.socket) {
          socketService.socket.emit('leave-order-tracking', order._id);
          socketService.socket.off('order-updated');
          socketService.socket.off('order-status-changed');
        }
      };
    }
  }, [order, isTracking]);

  const searchOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Search for order by orderId (ORD001, ORD002, etc.)
      const response = await fetch(`http://localhost:5000/api/orders/track/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        setIsTracking(true);
        setError('');
      } else {
        setError(data.message || 'Order not found. Please check your Order ID.');
        setOrder(null);
        setIsTracking(false);
      }
    } catch (error) {
      console.error('Error searching order:', error);
      setError('Unable to connect to server. Please try again.');
      setOrder(null);
      setIsTracking(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrder = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/track/${order.orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error refreshing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setOrder(null);
    setOrderId('');
    setIsTracking(false);
    setError('');
    if (socketService.socket) {
      socketService.disconnect();
    }
  };

  const getStatusStep = (status, cookingStatus) => {
    if (status === 'pending') return 0;
    if (status === 'accepted' && cookingStatus === 'not started') return 1;
    if (status === 'accepted' && ['preparing', 'cooking', 'plating'].includes(cookingStatus)) return 2;
    if (status === 'ready') return 3;
    if (status === 'delivered') return 4;
    return 0;
  };

  const getStatusText = (status, cookingStatus) => {
    if (status === 'pending') return 'Order Received';
    if (status === 'accepted' && cookingStatus === 'not started') return 'Order Accepted';
    if (status === 'accepted' && cookingStatus === 'preparing') return 'Preparing Ingredients';
    if (status === 'accepted' && cookingStatus === 'cooking') return 'Cooking in Progress';
    if (status === 'accepted' && cookingStatus === 'plating') return 'Final Touches';
    if (status === 'ready') return 'Ready for Pickup!';
    if (status === 'delivered') return 'Order Delivered';
    return 'Processing';
  };

  const getStatusColor = (status, cookingStatus) => {
    if (status === 'pending') return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (status === 'accepted' && cookingStatus === 'not started') return 'text-blue-600 bg-blue-100 border-blue-200';
    if (status === 'accepted' && ['preparing', 'cooking', 'plating'].includes(cookingStatus)) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (status === 'ready') return 'text-green-600 bg-green-100 border-green-200';
    if (status === 'delivered') return 'text-purple-600 bg-purple-100 border-purple-200';
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🍽️ Mian Taste</h1>
                <p className="text-gray-600">Live Order Tracking</p>
              </div>
            </div>
            {order && (
              <button
                onClick={refreshOrder}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Search Form */}
        {!order && (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h2>
              <p className="text-gray-600">Enter your Order ID to see real-time updates</p>
            </div>

            <form onSubmit={searchOrder} className="max-w-md mx-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    placeholder="Enter Order ID (e.g., ORD001)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Searching...' : 'Track Order'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>💡 Your Order ID is provided when you place an order</p>
              <p>Format: ORD001, ORD002, etc.</p>
            </div>
          </div>
        )}

        {/* Order Details and Live Tracking */}
        {order && (
          <div className="space-y-6">
            {/* Live Status Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                  <p className="text-green-700 font-medium">Live tracking active - Updates automatically</p>
                </div>
                <button
                  onClick={resetSearch}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Track Different Order
                </button>
              </div>
            </div>

            {/* Order Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">Order {order.orderId}</h3>
                    <p className="text-blue-100">{order.table} • {order.customerName}</p>
                    <p className="text-blue-100 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status, order.cookingStatus)}`}>
                      {getStatusText(order.status, order.cookingStatus)}
                    </div>
                    <p className="text-blue-100 text-sm mt-2">Total: Rs.{order.totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Progress Timeline */}
                <div className="relative mb-6">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div 
                    className="absolute left-8 top-0 w-0.5 bg-blue-500 transition-all duration-1000"
                    style={{ height: `${Math.min((getStatusStep(order.status, order.cookingStatus) / 4) * 100, 100)}%` }}
                  ></div>

                  <div className="space-y-8">
                    {[
                      { 
                        icon: CheckCircle, 
                        title: 'Order Received', 
                        desc: 'Your order has been confirmed and received',
                        step: 0
                      },
                      { 
                        icon: Clock, 
                        title: 'Order Accepted', 
                        desc: 'Chef has accepted and will start preparing',
                        step: 1
                      },
                      { 
                        icon: ChefHat, 
                        title: 'Preparing', 
                        desc: 'Your delicious meal is being prepared with care',
                        step: 2
                      },
                      { 
                        icon: Package, 
                        title: 'Ready for Pickup', 
                        desc: 'Your order is ready! Please come collect it',
                        step: 3
                      },
                      { 
                        icon: CheckCircle, 
                        title: 'Delivered', 
                        desc: 'Order completed successfully!',
                        step: 4
                      }
                    ].map((step, index) => {
                      const currentStep = getStatusStep(order.status, order.cookingStatus);
                      const isActive = index <= currentStep;
                      const isCurrent = index === currentStep;
                      const Icon = step.icon;

                      return (
                        <div key={index} className="relative flex items-start">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 z-10 ${
                            isActive 
                              ? 'bg-blue-500 border-blue-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className={`font-semibold ${isCurrent ? 'text-blue-600' : isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.title}
                              </h4>
                              {isCurrent && order.status !== 'delivered' && (
                                <span className="flex items-center">
                                  <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                                    Current
                                  </span>
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                              {step.desc}
                            </p>
                            {isCurrent && order.cookingStatus && order.cookingStatus !== 'not started' && (
                              <p className="text-sm text-blue-600 font-medium mt-2 flex items-center">
                                <Timer size={14} className="mr-1" />
                                Kitchen Status: {order.cookingStatus.charAt(0).toUpperCase() + order.cookingStatus.slice(1)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Order Details</h5>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-gray-900">Rs.{item.price}</span> {/* Changed from ₹{item.price} */}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-lg">Total: Rs.{order.totalAmount}</span> {/* Changed from ₹{order.totalAmount} */}
                      <p className="text-sm text-gray-500">Estimated: {order.estimatedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Ready Notification */}
                {order.status === 'ready' && (
                  <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4">
                    <div className="flex items-center">
                      <Package className="text-green-600 mr-3" size={24} />
                      <div>
                        <h4 className="font-semibold text-green-800">🎉 Your order is ready!</h4>
                        <p className="text-green-700 text-sm">Please come to the pickup counter to collect your delicious meal.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivered Notification */}
                {order.status === 'delivered' && (
                  <div className="mt-4 bg-purple-100 border border-purple-300 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="text-purple-600 mr-3" size={24} />
                      <div>
                        <h4 className="font-semibold text-purple-800">✅ Order Completed!</h4>
                        <p className="text-purple-700 text-sm">Thank you for dining with Mian Taste! We hope you enjoyed your meal.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;