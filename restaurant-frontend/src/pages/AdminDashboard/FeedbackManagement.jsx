import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, TrendingUp, BarChart3, Calendar, User, Eye, X, RefreshCw } from 'lucide-react';

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [orderTypeFilter]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000'
        : `http://${window.location.hostname}:5000`;
      
      const queryParams = new URLSearchParams();
      if (orderTypeFilter && orderTypeFilter !== 'all') {
        queryParams.append('orderType', orderTypeFilter);
      }
      
      const response = await fetch(`${baseUrl}/api/admin-feedback?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000'
        : `http://${window.location.hostname}:5000`;
      
      const response = await fetch(`${baseUrl}/api/admin-feedback/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StarDisplay = ({ rating, size = 16 }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300'
            }
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 2.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredFeedback = filter === 'all' 
    ? feedback 
    : feedback.filter(item => {
        if (filter === 'high') return item.averageRating >= 4;
        if (filter === 'medium') return item.averageRating >= 2.5 && item.averageRating < 4;
        if (filter === 'low') return item.averageRating < 2.5;
        return true;
      });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Customer Feedback
          </h1>
          <p className="text-gray-600">Monitor customer satisfaction and ratings</p>
        </div>
        <button 
          onClick={() => { fetchFeedback(); fetchStats(); }}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFeedback}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  <StarDisplay rating={Math.round(stats.averageRating)} size={20} />
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Ratings</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Ratings</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.ratingDistribution.filter(r => r.rating <= 2).reduce((sum, r) => sum + r.count, 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Order Type Filter Dropdown */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Order Type:</label>
          <select 
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
            className="px-3 py-2 border border-orange-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Order Types</option>
            <option value="qr">QR Orders</option>
            <option value="pre">Pre-Orders</option>
            <option value="reservation">Table Reservations</option>
          </select>
        </div>
        
        {/* Rating Filter Buttons */}
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'all', name: 'All Reviews', count: feedback.length },
            { id: 'high', name: 'High Ratings (4-5★)', count: feedback.filter(f => f.averageRating >= 4).length },
            { id: 'medium', name: 'Medium Ratings (2.5-4★)', count: feedback.filter(f => f.averageRating >= 2.5 && f.averageRating < 4).length },
            { id: 'low', name: 'Low Ratings (<2.5★)', count: feedback.filter(f => f.averageRating < 2.5).length }
          ].map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                filter === filterOption.id
                  ? 'btn-primary'
                  : 'bg-white text-gray-700 border-orange-200 hover:bg-orange-50'
              }`}
            >
              <span>{filterOption.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                filter === filterOption.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading feedback...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">Order Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">Ratings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedback.map(item => (
                  <tr key={item._id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.orderId}</div>
                        <div className="text-xs text-gray-500">
                          {item.orderType === 'qr' && 'QR Order'}
                          {item.orderType === 'pre' && 'Pre-Order'}
                          {item.orderType === 'reservation' && 'Table Reservation'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{item.customerInfo?.name || 'N/A'}</div>
                          {item.customerInfo?.email && (
                            <div className="text-xs text-gray-500">{item.customerInfo.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <StarDisplay rating={Math.round(item.averageRating)} />
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(item.averageRating)}`}>
                            {item.averageRating}/5
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.itemRatings && Object.keys(item.itemRatings).length > 0 
                            ? `${Object.keys(item.itemRatings).length} items rated`
                            : `Food: ${item.ratings?.food || 'N/A'}/5`
                          }, Service: {item.ratings?.service || 'N/A'}/5
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedFeedback(item);
                          setShowModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No feedback found</p>
          <p className="text-gray-400">Customer reviews will appear here as they submit feedback</p>
        </div>
      )}

      {/* Feedback Details Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Feedback Details - {selectedFeedback.orderId}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span>{selectedFeedback.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Type:</span>
                      <span className="capitalize">{selectedFeedback.orderType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span>{selectedFeedback.customerInfo?.name || 'N/A'}</span>
                    </div>
                    {selectedFeedback.customerInfo?.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{selectedFeedback.customerInfo.email}</span>
                      </div>
                    )}
                    {selectedFeedback.customerInfo?.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedFeedback.customerInfo.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{formatDate(selectedFeedback.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Overall Rating</h4>
                  <div className="flex items-center space-x-3">
                    <StarDisplay rating={Math.round(selectedFeedback.averageRating)} size={24} />
                    <span className="text-2xl font-bold text-orange-600">{selectedFeedback.averageRating}/5</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Detailed Ratings</h4>
                <div className="grid gap-3">
                  {/* Individual Food Item Ratings (New System) */}
                  {selectedFeedback.itemRatings && Object.keys(selectedFeedback.itemRatings).length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Individual Food Items</h5>
                      {Object.entries(selectedFeedback.itemRatings).map(([itemName, rating], index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-4 mb-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{itemName}</span>
                            <div className="flex items-center space-x-2">
                              <StarDisplay rating={rating} />
                              <span className="text-sm text-gray-600">{rating}/5</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Service Rating */}
                  {selectedFeedback.ratings?.service > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Service Quality</span>
                        <div className="flex items-center space-x-2">
                          <StarDisplay rating={selectedFeedback.ratings.service} />
                          <span className="text-sm text-gray-600">{selectedFeedback.ratings.service}/5</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Legacy/Old System Support */}
                  {selectedFeedback.ratings?.food > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Food Quality (Overall)</span>
                        <div className="flex items-center space-x-2">
                          <StarDisplay rating={selectedFeedback.ratings.food} />
                          <span className="text-sm text-gray-600">{selectedFeedback.ratings.food}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedFeedback.ratings?.ambiance > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Ambiance</span>
                        <div className="flex items-center space-x-2">
                          <StarDisplay rating={selectedFeedback.ratings.ambiance} />
                          <span className="text-sm text-gray-600">{selectedFeedback.ratings.ambiance}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Legacy QR feedback support */}
                  {selectedFeedback.itemFeedback && selectedFeedback.itemFeedback.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{item.itemName} (Legacy)</span>
                        <div className="flex items-center space-x-2">
                          <StarDisplay rating={item.rating} />
                          <span className="text-sm text-gray-600">{item.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {(selectedFeedback.comment || selectedFeedback.overallComment) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Comment</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedFeedback.comment || selectedFeedback.overallComment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;