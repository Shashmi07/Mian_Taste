import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, User, Phone, MapPin, Car, Package, UtensilsCrossed, Filter, ChevronDown, Eye, X, RefreshCw, XCircle } from 'lucide-react';

const PreOrderManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch PreOrders from API
  useEffect(() => {
    fetchPreOrders();
    
    // Set up silent real-time polling every 5 seconds
    const interval = setInterval(() => {
      fetchPreOrders(false, true); // silent mode = true
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPreOrders = async (showRefreshing = false, silentMode = false) => {
    try {
      if (showRefreshing && !silentMode) {
        setRefreshing(true);
      } else if (orders.length === 0 && !silentMode) {
        // Only show loading spinner on initial load
        setLoading(true);
      }
      
      const response = await fetch(`${API_URL}/pre-orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!silentMode) {
        console.log('Fetched preorders:', data);
      }
      
      if (data.success) {
        // Sort orders by priority: upcoming scheduled date/time first
        const sortedOrders = data.orders.sort((a, b) => {
          const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`);
          const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`);
          return dateA - dateB; // Ascending order (soonest first)
        });
        
        // Only update if data has changed (silent mode optimization)
        if (silentMode) {
          const currentOrdersString = JSON.stringify(orders);
          const newOrdersString = JSON.stringify(sortedOrders);
          if (currentOrdersString !== newOrdersString) {
            setOrders(sortedOrders);
          }
        } else {
          setOrders(sortedOrders);
        }
      }
    } catch (error) {
      if (!silentMode) {
        console.error('Error fetching preorders:', error);
      }
    } finally {
      if (!silentMode) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Count orders by status
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  // Filter orders
  const getFilteredOrders = (filterType) => {
    let filtered = orders;
    if (filterType === 'confirmed') {
      filtered = orders.filter(order => order.status === 'confirmed');
    } else if (filterType === 'completed') {
      filtered = orders.filter(order => order.status === 'completed');
    }
    return filtered;
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/pre-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchPreOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating preorder status:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this pre-order? The customer will be notified.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pre-orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Pre-order cancelled successfully. Customer has been notified.');
        fetchPreOrders(); // Refresh orders
      } else {
        alert(data.message || 'Failed to cancel pre-order');
      }
    } catch (error) {
      console.error('Error cancelling preorder:', error);
      alert('Failed to cancel pre-order. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isToday = (dateString) => {
    const orderDate = new Date(dateString).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  };

  const isUpcoming = (dateString, timeString) => {
    const now = new Date();
    const orderDateTime = new Date(`${dateString} ${timeString}`);
    return orderDateTime > now;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'dine-in': return <UtensilsCrossed className="w-4 h-4" />;
      case 'takeaway': return <Package className="w-4 h-4" />;
      case 'delivery': return <Car className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'dine-in': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'takeaway': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivery': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderOrderRow = (order) => (
    <tr key={order._id} className={`border-b hover:bg-gray-50 ${
      isToday(order.scheduledDate) ? 'bg-yellow-50 border-yellow-200' : ''
    }`}>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{order.orderId}</div>
        <div className="text-sm text-gray-500">{order.orderTime}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{order.customerName}</div>
        <div className="text-sm text-gray-500">{order.customerPhone}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(order.orderType)}`}>
          {getTypeIcon(order.orderType)}
          <span className="ml-1 capitalize">{order.orderType.replace('-', ' ')}</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <div className={`font-medium ${isToday(order.scheduledDate) ? 'text-orange-600' : 'text-gray-900'}`}>
          {formatDate(order.scheduledDate)}
        </div>
        <div className="text-sm text-gray-500">
          {order.scheduledTime}
          {isToday(order.scheduledDate) && <span className="text-orange-600 font-medium"> (TODAY)</span>}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="text-gray-900 font-medium ml-2">Rs.{item.price}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold text-purple-600">Rs.{order.totalAmount}</div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setIsModalOpen(true);
          }}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {order.status === 'confirmed' ? (
            <>
              <button
                onClick={() => updateOrderStatus(order._id, 'completed')}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </button>
              <button
                onClick={() => cancelOrder(order._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <span className="text-green-600 font-medium">✅ Completed</span>
          )}
        </div>
      </td>
    </tr>
  );

  const renderTable = (title, ordersList, showEmpty = true) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {ordersList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordersList.map(renderOrderRow)}
            </tbody>
          </table>
        </div>
      ) : (
        showEmpty && (
          <div className="text-center py-8">
            <p className="text-gray-500">No {title.toLowerCase()} found</p>
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Pre-Orders Management
          </h1>
          <p className="text-gray-600">Manage scheduled orders by priority and status • Updates automatically</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchPreOrders(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 border border-blue-200 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-blue-700 font-medium">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
          
          {/* Blinking red counter for confirmed orders */}
          {confirmedCount > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 border border-red-200 rounded-lg px-3 py-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">
                {confirmedCount} Pending Order{confirmedCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Pre-Order Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order ID and Status */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Order ID: {selectedOrder.orderId}</h3>
                  <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedOrder.status === 'completed' ? '✅ Completed' : '⏳ Confirmed'}
                </span>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Type and Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Order Type</h4>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedOrder.orderType)}
                    <span className="capitalize font-medium">{selectedOrder.orderType.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Scheduled For</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{formatDate(selectedOrder.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedOrder.scheduledTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address or Table */}
              {selectedOrder.orderType === 'delivery' && selectedOrder.deliveryAddress && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <p>{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>
              )}

          

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-purple-600">Rs.{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold">Total Amount:</p>
                  <p className="text-xl font-bold text-purple-600">Rs.{selectedOrder.totalAmount}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
                <p className="font-medium capitalize">{selectedOrder.paymentMethod || 'Card'}</p>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Special Notes</h4>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="confirmed">Confirmed Orders ({confirmedCount})</option>
            <option value="completed">Completed Orders ({completedCount})</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading pre-orders...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Show tables based on filter */}
          {selectedFilter === 'all' && (
            <>
              {/* Confirmed Orders (Priority) */}
              {confirmedCount > 0 && renderTable('🔥 Confirmed Orders (Priority)', getFilteredOrders('confirmed'), false)}
              
              {/* Completed Orders */}
              {completedCount > 0 && renderTable('✅ Completed Orders', getFilteredOrders('completed'), false)}
              
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No pre-orders found</p>
                  <p className="text-gray-400">Pre-orders will appear here as customers place them</p>
                </div>
              )}
            </>
          )}
          
          {selectedFilter === 'confirmed' && renderTable('Confirmed Orders', getFilteredOrders('confirmed'))}
          {selectedFilter === 'completed' && renderTable('Completed Orders', getFilteredOrders('completed'))}
        </div>
      )}
    </div>
  );
};

export default PreOrderManagement;