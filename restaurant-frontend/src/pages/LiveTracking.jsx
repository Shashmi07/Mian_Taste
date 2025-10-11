import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Package, Timer, RefreshCw, Search, ArrowLeft, Star, MessageSquare, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import socketService from '../services/socket';

const LiveTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [overallComment, setOverallComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  
  const { clearCart } = useCart();

  // Auto-load tracking order ID if available
  useEffect(() => {
    const trackingOrderId = sessionStorage.getItem('trackingOrderId');
    if (trackingOrderId) {
      setOrderId(trackingOrderId);
      // Auto-search for the order
      setTimeout(() => {
        trackOrder(trackingOrderId);
      }, 500);
      // Clear the session storage after use
      sessionStorage.removeItem('trackingOrderId');
    }
  }, []);

  const trackOrder = (orderIdToTrack) => {
    const e = { preventDefault: () => {} };
    searchOrder(e, orderIdToTrack);
  };
  const navigate = useNavigate();

  // Handle mobile app lifecycle for socket connection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && order && isTracking) {
        console.log('📱 App became visible - ensuring socket connection');
        if (!socketService.connected) {
          socketService.connect();
        }
      }
    };

    const handleOnline = () => {
      console.log('📱 Device back online - reconnecting socket');
      if (order && isTracking && !socketService.connected) {
        socketService.connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [order, isTracking]);

  useEffect(() => {
    if (order && isTracking) {
      console.log('🔌 Setting up real-time tracking for order:', order.orderId);
      
      // Connect to socket for real-time updates
      socketService.connect();
      
      // Wait for connection before setting up listeners
      const setupTracking = () => {
        if (socketService.socket && socketService.connected) {
          console.log('📡 Socket connected, joining order tracking room');
          setSocketConnected(true);
          
          // Join order-specific room for updates
          socketService.socket.emit('join-order-tracking', order._id);
          
          // Use the new socket service methods for QR orders
          socketService.onQrOrderUpdate((updatedOrder) => {
            console.log('📱 Real-time QR order update received:', updatedOrder);
            console.log('📱 Current order ID:', order._id);
            console.log('📱 Updated order ID:', updatedOrder._id);
            if (updatedOrder._id === order._id) {
              console.log('✅ Order IDs match - updating order state');
              setOrder(updatedOrder);
            } else {
              console.log('❌ Order IDs do not match');
            }
          });

          socketService.onQrOrderStatusChange((data) => {
            console.log('📱 QR Order status changed:', data);
            console.log('📱 Current order ID:', order._id);
            console.log('📱 Status change order ID:', data.orderId);
            if (data.orderId === order._id) {
              console.log('✅ Status change for current order - updating');
              setOrder(prev => ({
                ...prev,
                status: data.status,
                cookingStatus: data.cookingStatus
              }));
            } else {
              console.log('❌ Status change for different order');
            }
          });
        } else {
          console.log('⏳ Waiting for socket connection...');
          setSocketConnected(false);
          // Retry connection after a short delay
          setTimeout(setupTracking, 1000);
        }
      };

      if (socketService.connected) {
        setupTracking();
      } else {
        socketService.socket?.on('connect', setupTracking);
      }

      return () => {
        console.log('🧹 Cleaning up socket listeners');
        if (socketService.socket) {
          socketService.socket.emit('leave-order-tracking', order._id);
          socketService.socket.off('qr-order-updated');
          socketService.socket.off('qr-order-status-changed');
        }
      };
    }
  }, [order, isTracking]);

  const searchOrder = async (e, customOrderId = null) => {
    e.preventDefault();
    const searchOrderId = customOrderId || orderId;
    if (!searchOrderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Search for QR order by orderId (QR001234, etc.)
      // Use current hostname for backend URL (works for both localhost and IP addresses)
      const baseUrl = `http://${window.location.hostname}:5000`;
      console.log('Tracking API URL:', baseUrl);

      const response = await fetch(`${baseUrl}/api/qr-orders/track/${searchOrderId}`, {
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
      // Use current hostname for backend URL (works for both localhost and IP addresses)
      const baseUrl = `http://${window.location.hostname}:5000`;

      const response = await fetch(`${baseUrl}/api/qr-orders/track/${order.orderId}`);
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
    if (status === 'ready') return 'Ready for Service!';
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

  const handleStarRating = (itemIndex, rating) => {
    setFeedback(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        rating: rating
      }
    }));
  };


  const skipFeedback = () => {
    setShowFeedback(false);
    setFeedback({});
    setOverallComment('');
    
    // Clear the cart since the order is complete (even if feedback is skipped)
    clearCart();
    
    // Also clear any QR table info since order is complete
    localStorage.removeItem('qrTableNumber');
  };

  const submitFeedback = async () => {
    setSubmittingFeedback(true);

    try {
      // Use current hostname for backend URL (works for both localhost and IP addresses)
      const baseUrl = `http://${window.location.hostname}:5000`;

      const feedbackData = {
        orderId: order.orderId, // Use the order ID string, not the MongoDB _id
        orderType: 'qr', // Add the missing orderType field
        orderNumber: order.orderId,
        itemFeedback: Object.keys(feedback).map(index => ({
          itemIndex: parseInt(index),
          itemName: order.items[index].name,
          rating: feedback[index]?.rating || 0
        })),
        overallComment: overallComment,
        customerName: order.customerName,
        table: order.table,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        alert('🎉 Thank you for your feedback! We appreciate your input to help us improve.');
        setShowFeedback(false);
        setFeedback({});
        setOverallComment('');
        
        // Clear the cart since the order is complete and feedback is submitted
        clearCart();
        
        // Also clear any QR table info since order is complete
        localStorage.removeItem('qrTableNumber');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Sorry, we could not submit your feedback right now. Please try again later.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const StarRating = ({ rating, onRate, size = 20 }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className="focus:outline-none"
          >
            <Star 
              size={size}
              className={star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300 hover:text-yellow-200'
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-red-100 hover:text-white hover:bg-red-800 hover:bg-opacity-30 rounded-lg touch-manipulation"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">🍽️ Mian Taste</h1>
                <p className="text-red-100 text-sm sm:text-base">Live Order Tracking</p>
              </div>
            </div>
            {order && (
              <button
                onClick={refreshOrder}
                disabled={loading}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-red-100 hover:text-white hover:bg-red-800 hover:bg-opacity-30 rounded-lg disabled:opacity-50 touch-manipulation"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Search Form */}
        {!order && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Track Your Order</h2>
              <p className="text-gray-600 text-sm sm:text-base">Enter your Order ID to see real-time updates</p>
            </div>

            <form onSubmit={searchOrder} className="max-w-md mx-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    placeholder="Enter Order ID (e.g., QR001234)"
                    className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors touch-manipulation min-h-[48px]"
                >
                  {loading ? 'Searching...' : 'Track Order'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs sm:text-sm text-gray-500 space-y-1">
              <p>💡 Your Order ID is provided when you place an order</p>
              <p>Format: QR001234, QR001235, etc.</p>
            </div>
          </div>
        )}

        {/* Order Details and Live Tracking */}
        {order && (
          <div className="space-y-6">
            {/* Live Status Banner */}
            <div className={`border rounded-lg p-3 sm:p-4 ${socketConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  <p className={`font-medium text-sm sm:text-base ${socketConnected ? 'text-green-700' : 'text-yellow-700'}`}>
                    {socketConnected ? 'Live tracking active - Updates automatically' : 'Connecting to live tracking...'}
                  </p>
                </div>
                <button
                  onClick={resetSearch}
                  className="text-green-600 hover:text-green-800 text-sm touch-manipulation self-start sm:self-auto"
                >
                  Track Different Order
                </button>
              </div>
            </div>

            {/* Order Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-red-900 to-red-700 p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold">Order {order.orderId}</h3>
                    <p className="text-red-100 text-sm sm:text-base">{order.table} • {order.customerName}</p>
                    <p className="text-red-100 text-xs sm:text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col sm:text-right space-y-2">
                    <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(order.status, order.cookingStatus)} inline-block`}>
                      {getStatusText(order.status, order.cookingStatus)}
                    </div>
                    <p className="text-red-100 text-sm font-semibold">Total: Rs.{order.totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Progress Timeline */}
                <div className="relative mb-4 sm:mb-6">
                  {/* Background line */}
                  <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Progress line with flowing animation */}
                  <div 
                    className="absolute left-4 sm:left-8 top-0 w-1 bg-gradient-to-b from-red-400 to-red-600 transition-all duration-1000 overflow-hidden rounded-full"
                    style={{ height: `${Math.min((getStatusStep(order.status, order.cookingStatus) / 4) * 100, 100)}%` }}
                  >
                    {/* Flowing animation - only show if order is in progress */}
                    {order.status !== 'delivered' && getStatusStep(order.status, order.cookingStatus) > 0 && (
                      <>
                        {/* Continuous flowing stream */}
                        <div 
                          className="absolute inset-0 opacity-60"
                          style={{
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 20%, transparent 40%, rgba(255,255,255,0.6) 60%, transparent 80%, rgba(255,255,255,0.4) 100%)',
                            animation: 'flowStream 2s linear infinite'
                          }}
                        ></div>
                        
                        {/* Secondary flowing layer */}
                        <div 
                          className="absolute inset-0 opacity-40"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(220,38,38,0.6) 0%, transparent 30%, rgba(220,38,38,0.4) 70%, transparent 100%)',
                            animation: 'flowStream 3s linear infinite reverse'
                          }}
                        ></div>
                        
                        {/* Fast flowing dots */}
                        <div 
                          className="absolute w-full h-2 rounded-full opacity-70"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)',
                            animation: 'flowDots 1.5s linear infinite'
                          }}
                        ></div>
                      </>
                    )}
                  </div>

                  {/* Custom CSS for flowing animations */}
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      @keyframes flowStream {
                        0% {
                          transform: translateY(-100%);
                        }
                        100% {
                          transform: translateY(100%);
                        }
                      }
                      
                      @keyframes flowDots {
                        0% {
                          transform: translateY(-20px);
                          opacity: 0;
                        }
                        20% {
                          opacity: 1;
                        }
                        80% {
                          opacity: 1;
                        }
                        100% {
                          transform: translateY(200px);
                          opacity: 0;
                        }
                      }
                    `
                  }} />

                  <div className="space-y-6 sm:space-y-8">
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
                        title: 'Ready for Service', 
                        desc: 'Your delicious meal is ready! Waiter will serve it to your table shortly',
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
                              ? 'bg-red-600 border-red-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="ml-3 sm:ml-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                              <h4 className={`font-semibold text-sm sm:text-base ${isCurrent ? 'text-red-600' : isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.title}
                              </h4>
                              {isCurrent && order.status !== 'delivered' && (
                                <span className="flex items-center">
                                  <span className="text-xs sm:text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1 sm:mr-2"></div>
                                    Current
                                  </span>
                                </span>
                              )}
                            </div>
                            <p className={`text-xs sm:text-sm mt-1 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                              {step.desc}
                            </p>
                            {isCurrent && order.cookingStatus && order.cookingStatus !== 'not started' && (
                              <p className="text-xs sm:text-sm text-red-600 font-medium mt-2 flex items-center">
                                <Timer size={12} className="mr-1" />
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
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h5 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Order Details</h5>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm sm:text-base">
                        <span className="text-gray-700 flex-1 pr-2">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-gray-900 whitespace-nowrap">Rs.{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                      <span className="font-semibold text-base sm:text-lg">Total: Rs.{order.totalAmount}</span>
                      <p className="text-xs sm:text-sm text-gray-500">Estimated: {order.estimatedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Ready Notification */}
                {order.status === 'ready' && (
                  <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start">
                      <Package className="text-green-600 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-green-800 text-sm sm:text-base">🎉 Your order is ready for service!</h4>
                        <p className="text-green-700 text-xs sm:text-sm mt-1">Our waiter will bring your delicious meal to your table shortly.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivered Notification */}
                {order.status === 'delivered' && (
                  <div className="mt-4 bg-purple-100 border border-purple-300 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start">
                      <CheckCircle className="text-purple-600 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800 text-sm sm:text-base">✅ Order Completed!</h4>
                        <p className="text-purple-700 text-xs sm:text-sm mt-1">Thank you for dining with Mian Taste! We hope you enjoyed your meal.</p>
                        
                        {/* Feedback Button */}
                        <div className="mt-3">
                          <button
                            onClick={() => setShowFeedback(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <Star className="w-4 h-4" />
                            <span>Rate Your Experience</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && order && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h3 className="text-xl font-bold text-gray-900">🌟 Rate Your Experience</h3>
                <button 
                  onClick={() => setShowFeedback(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-800">Order {order.orderId}</h4>
                  <p className="text-gray-600">Help us improve by rating each item</p>
                </div>

                {/* Rate Each Item */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-800">Rate Each Item:</h5>
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h6 className="font-medium text-gray-800">{item.name}</h6>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × Rs. {item.price}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <StarRating 
                            rating={feedback[index]?.rating || 0} 
                            onRate={(rating) => handleStarRating(index, rating)} 
                          />
                          <span className="text-xs text-gray-500 mt-1">
                            {feedback[index]?.rating ? `${feedback[index].rating}/5` : 'No rating'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Experience (Optional):
                  </label>
                  <textarea
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                    placeholder="Tell us about your overall dining experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={skipFeedback}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    onClick={submitFeedback}
                    disabled={submittingFeedback}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {submittingFeedback ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;