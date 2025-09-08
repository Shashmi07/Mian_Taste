import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Send, CheckCircle, ArrowLeft, Calendar, Clock, UtensilsCrossed, Users } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const FeedbackPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [order, setOrder] = useState(null);
  const [orderType, setOrderType] = useState(''); // 'qr', 'pre', 'reservation'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Feedback state
  const [ratings, setRatings] = useState({
    food: 0,
    service: 0,
    ambiance: 0,
    overall: 0
  });
  const [comment, setComment] = useState('');

  // Fetch order details based on orderId
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Use the universal feedback endpoint
      const response = await fetch(`http://localhost:5000/api/feedback/order/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order || data.reservation);
        setOrderType(data.orderType);
        
        // If feedback already exists, show message
        if (data.feedbackExists) {
          setSubmitted(true);
        }
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category, rating) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const renderStars = (category, currentRating) => {
    return (
      <div className="flex space-x-2 sm:space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(category, star)}
            className={`transition-colors p-1 ${
              star <= currentRating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star 
              size={28} 
              className="sm:w-6 sm:h-6"
              fill={star <= currentRating ? 'currentColor' : 'none'} 
            />
          </button>
        ))}
      </div>
    );
  };

  const submitFeedback = async () => {
    try {
      setSubmitting(true);

      // Validate required fields
      if (ratings.food === 0 || ratings.service === 0) {
        alert('Please provide ratings for food quality and service quality');
        return;
      }

      const feedbackData = {
        orderId,
        orderType,
        ratings,
        comment: comment.trim(),
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        alert(result.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">Order Not Found</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft size={16} />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-green-100 border border-green-300 rounded-lg p-8 max-w-md mx-auto">
              <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
              <h3 className="text-green-800 font-semibold text-xl mb-2">Thank You!</h3>
              <p className="text-green-600 mb-6">
                Your feedback has been submitted successfully. We appreciate your time and will use your feedback to improve our service.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Rate Your Experience</h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">Help us improve by sharing your feedback</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Order Details</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                {orderId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {orderType === 'pre' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">
                      {new Date(order.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">{order.scheduledTime}</span>
                  </div>
                </>
              )}
              
              {orderType === 'reservation' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">
                      {new Date(order.reservationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-600">
                      Table {order.selectedTables?.join(', ')}
                    </span>
                  </div>
                </>
              )}

              {orderType === 'qr' && (
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-600">Table {order.table}</span>
                </div>
              )}
            </div>

            {/* Order Items */}
            {(order.items || order.foodItems) && (
              <div className="overflow-x-auto">
                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Items Ordered:</h4>
                <div className="space-y-1">
                  {(order.items || order.foodItems || []).map((item, index) => (
                    <div key={index} className="flex justify-between text-xs sm:text-sm text-gray-600 py-1">
                      <span className="flex-1 pr-2">{item.name} x{item.quantity}</span>
                      <span className="font-medium">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium text-sm sm:text-base">
                    <span>Total</span>
                    <span className="text-red-600">Rs. {order.totalAmount || order.grandTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">How would you rate your experience?</h3>

            {/* Rating Categories */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Food Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Quality <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center sm:justify-start">
                  {renderStars('food', ratings.food)}
                </div>
              </div>

              {/* Service Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Quality <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center sm:justify-start">
                  {renderStars('service', ratings.service)}
                </div>
              </div>


              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={submitFeedback}
                  disabled={submitting || ratings.food === 0 || ratings.service === 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1 mx-auto"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeedbackPage;