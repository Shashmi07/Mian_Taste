import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, ChefHat, Timer, Eye, Minus, Bell, Users, Plus, AlertCircle, LogOut } from 'lucide-react';
import { ordersAPI, inventoryAPI } from '../services/api';
import socketService from '../services/socket';
import OrderCard from '../components/OrderCard';

export default function ChefDashboard({ user, onLogout }) {
  // Dynamic API URL - use environment variable for production, localhost for development
  const getAPIURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api'
      : `http://${window.location.hostname}:5000/api`;
  };
  const API_URL = getAPIURL();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [reduceAmounts, setReduceAmounts] = useState({});
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('all');
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    minStock: 10
  });

  useEffect(() => {
    console.log('useEffect running');
    
    loadOrders();
    loadInventory();

    // Connect socket and join kitchen room
    socketService.connect();
    
    const connectAndJoin = () => {
      if (socketService.socket) {
        socketService.socket.emit('join-kitchen');
        console.log('Joined kitchen room');
      }
    };

    if (socketService.connected) {
      connectAndJoin();
    } else {
      socketService.socket?.on('connect', connectAndJoin);
    }

    // Socket event listeners
    socketService.onOrderUpdate((updatedOrder) => {
      console.log('Order update received:', updatedOrder);
      setOrders(prev => prev.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      ));
    });

    // Listen for new orders
    socketService.onNewOrder((newOrder) => {
      console.log('New order received:', newOrder);
      setOrders(prev => [newOrder, ...prev]);
    });

    // Auto-refresh as backup every 30 seconds
    const refreshInterval = setInterval(() => {
      loadOrders();
    }, 30000);

    return () => {
      socketService.disconnect();
      clearInterval(refreshInterval);
    };
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login');
        onLogout();
        return;
      }
      
      // Load only QR orders
      const qrOrdersResponse = await fetch(`${API_URL}/qr-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.json());
      
      const qrOrders = qrOrdersResponse.success ? qrOrdersResponse.orders : [];
      
      // Sort orders by creation date (newest first)
      const sortedOrders = qrOrders.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      if (error.response?.status === 401) {
        console.error('Authentication failed, redirecting to login');
        onLogout();
        return;
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login');
        onLogout();
        return;
      }
      const response = await inventoryAPI.getInventory();
      setInventory(response.data.inventory || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      if (error.response?.status === 401) {
        console.error('Authentication failed, redirecting to login');
        onLogout();
        return;
      }
      setInventory([]);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      console.log('Accepting QR order:', orderId);
      
      // Accept QR order
      const response = await fetch(`${API_URL}/qr-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'accepted' })
      });
      const data = await response.json();
      
      console.log('Accept response:', data);
      
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? data.order : order
        ));
        
        // Automatically switch to active orders tab for seamless workflow
        setSelectedOrderFilter('active');
        
        // Optional: Show a brief success message
        setTimeout(() => {
          console.log('Order accepted successfully. Switched to Active Orders tab.');
        }, 100);
      } else {
        alert('Failed to accept order: ' + data.message);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order: ' + error.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      console.log('Updating QR order status:', orderId, status);
      
      // Update QR order status
      const response = await fetch(`${API_URL}/qr-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      
      console.log('Status response:', data);
      
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? data.order : order
        ));
        
        // Automatically switch to appropriate tab for seamless workflow
        if (status === 'ready') {
          setSelectedOrderFilter('ready');
          console.log('Order marked as ready for service. Switched to Ready Orders tab.');
        } else if (status === 'delivered') {
          setSelectedOrderFilter('completed');
          console.log('Order marked as delivered. Switched to Completed Orders tab.');
        }
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status: ' + error.message);
    }
  };

  const handleUpdateCookingStatus = async (orderId, cookingStatus) => {
    try {
      console.log('Updating QR order cooking status:', orderId, cookingStatus);
      
      // Update QR order cooking status
      const response = await fetch(`${API_URL}/qr-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cookingStatus })
      });
      const data = await response.json();
      
      console.log('Cooking status response:', data);
      
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? data.order : order
        ));
      } else {
        alert('Failed to update cooking status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating cooking status:', error);
      alert('Failed to update cooking status: ' + error.message);
    }
  };

  const updateInventoryQuantity = async (itemId, amount, unit, operation) => {
    try {
      await inventoryAPI.updateQuantity(itemId, { operation, amount, unit });
      loadInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const handleAddInventoryItem = async (e) => {
    e.preventDefault();
    try {
      const response = await inventoryAPI.addItem({
        name: newItem.name,
        quantity: Number(newItem.quantity),
        unit: newItem.unit,
        minStock: Number(newItem.minStock)
      });
      
      if (response.data.success) {
        loadInventory(); // Refresh inventory list
        setNewItem({ name: '', quantity: '', unit: 'g', minStock: 10 });
        setShowAddItemForm(false);
      } else {
        alert('Failed to add item: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      alert('Failed to add item: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatQuantity = (quantity, unit) => {
    if (unit === 'g' && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)} kg`;
    }
    return `${quantity} ${unit}`;
  };

  const convertToGrams = (amount, unit) => {
    if (unit === 'kg') {
      return amount * 1000;
    }
    return amount;
  };

  const updateInventoryStatus = (quantity, minStock) => {
    if (quantity === 0) return 'out of stock';
    if (quantity <= minStock * 0.5) return 'low';
    return 'available';
  };

  // Get out of stock items for notifications
  const getOutOfStockItems = () => {
    return inventory.filter(item => item.quantity === 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'finished': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'; // Changed from 'ready for pickup'
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInventoryStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out of stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50">
      {/* Notification Dropdown Overlay */}
      {showNotifications && (
        <div className="fixed inset-0 z-[9999]" onClick={() => setShowNotifications(false)}>
          <div 
            className="absolute bg-white border-2 border-gray-300 rounded-xl shadow-2xl w-80"
            style={{ 
              right: '20px',
              top: '70px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Bell className="text-red-500 mr-2" size={18} />
                Inventory Notifications
              </h3>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {getOutOfStockItems().length > 0 ? (
                <div className="p-3">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Critical Items</p>
                  </div>
                  {getOutOfStockItems().map(item => (
                    <div key={item._id} className="flex justify-between items-center py-3 px-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg mb-2 border-l-4 border-red-500">
                      <div className="flex items-center">
                        <AlertCircle className="text-red-500 mr-2" size={16} />
                        <span className="text-sm text-red-800 font-medium">{item.name}</span>
                      </div>
                      <span className="text-xs text-red-600 bg-red-200 px-2 py-1 rounded-full font-semibold">
                        OUT OF STOCK
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-green-500" size={28} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">All Good!</h4>
                  <p className="text-sm text-gray-500">No notifications at the moment.</p>
                  <p className="text-xs text-gray-400 mt-2">All inventory items are in stock.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <nav className="bg-gradient-to-r from-red-900 via-red-800 to-orange-700 text-white shadow-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center group">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <ChefHat className="text-white" size={28} />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white tracking-tight">Chef Dashboard</h1>
                <p className="text-red-100 text-sm">Kitchen Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="relative p-2 text-red-100 hover:text-white hover:bg-red-800 hover:bg-opacity-30 rounded-lg"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {getOutOfStockItems().length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {getOutOfStockItems().length}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-red-600 bg-opacity-20 backdrop-blur-sm px-4 py-2 border border-red-400 border-opacity-50" style={{borderRadius: '25px'}}>
                <div className="w-7 h-7 bg-red-500 flex items-center justify-center text-white font-medium text-sm" style={{borderRadius: '50%'}}>
                  {(user?.name || 'Chef')[0]?.toUpperCase() || 'C'}
                </div>
                <div className="text-right">
                  <p className="font-medium text-white text-sm">{(user?.name || 'Chef').split(' ')[0]}</p>
                  <p className="text-xs text-red-100">Chef</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-red-100 hover:text-white px-4 py-2 rounded-lg hover:bg-red-800 hover:bg-opacity-30 transition-all duration-300 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('pending');
            }}
            className="group bg-gradient-to-br from-white to-red-50 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 text-left border border-red-100 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Pending Orders</p>
                <p className={`text-2xl font-bold text-red-600 ${
                  orders.filter(o => o.status === 'pending').length > 0 
                    ? 'animate-pulse' 
                    : ''
                }`}>
                  {orders.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-xs text-red-500 font-medium">Needs Attention</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Clock className="text-red-600" size={20} />
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('active');
            }}
            className="group bg-gradient-to-br from-white to-orange-50 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 text-left border border-orange-100 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Active Orders</p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => o.status === 'accepted' || o.status === 'preparing' || o.status === 'finished').length}
                </p>
                <p className="text-xs text-orange-500 font-medium">In Progress</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <ChefHat className="text-orange-600" size={20} />
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('ready');
            }}
            className="group bg-gradient-to-br from-white to-green-50 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 text-left border border-green-100 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Ready for Service</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
                <p className="text-xs text-green-500 font-medium">Ready to Go</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('completed');
            }}
            className="group bg-gradient-to-br from-white to-purple-50 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 text-left border border-purple-100 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-xs text-purple-500 font-medium">Total Served</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Users className="text-purple-600" size={20} />
              </div>
            </div>
          </button>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex space-x-2 bg-gradient-to-r from-white to-gray-50 rounded-2xl p-2 mb-8 shadow-lg border border-gray-100">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-md'
            }`}
          >
            <Clock className="mr-2" size={20} />
            Orders Management
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-md'
            }`}
          >
            <Package className="mr-2" size={20} />
            Inventory Control
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
                <p className="text-gray-600">Track and manage kitchen orders in real-time</p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                <select 
                  value={selectedOrderFilter}
                  onChange={(e) => setSelectedOrderFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="all">🍽️ All Orders</option>
                  <option value="pending">⏰ Pending</option>
                  <option value="active">👨‍🍳 Active</option>
                  <option value="ready">✅ Ready for Service</option>
                  <option value="completed">🎉 Completed</option>
                </select>
              </div>
            </div>

            {(() => {
              const filteredOrders = orders.filter(order => {
                if (selectedOrderFilter === 'all') return true;
                if (selectedOrderFilter === 'pending') return order.status === 'pending';
                if (selectedOrderFilter === 'active') return order.status === 'accepted' || order.status === 'preparing' || order.status === 'finished';
                if (selectedOrderFilter === 'ready') return order.status === 'ready'; // Changed from 'ready for pickup'
                if (selectedOrderFilter === 'completed') return order.status === 'delivered';
                return false;
              });

              return (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map(order => (
                      <OrderCard 
                        key={order._id} 
                        order={order}
                        onAccept={handleAcceptOrder}
                        onUpdateStatus={handleUpdateOrderStatus}
                        onUpdateCookingStatus={handleUpdateCookingStatus}
                      />
                    ))}
                  </div>

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No {selectedOrderFilter === 'all' ? '' : selectedOrderFilter} orders
                      </h3>
                      <p className="text-gray-500">
                        {selectedOrderFilter === 'pending' && 'No new orders waiting.'}
                        {selectedOrderFilter === 'active' && 'No orders being prepared.'}
                        {selectedOrderFilter === 'ready' && 'No orders ready for service.'}
                        {selectedOrderFilter === 'completed' && 'No completed orders.'}
                        {selectedOrderFilter === 'all' && 'No orders at the moment.'}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Inventory</h2>
                <p className="text-gray-600">Monitor stock levels and manage ingredients</p>
              </div>
              <button
                onClick={() => setShowAddItemForm(!showAddItemForm)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} className="mr-2" />
                Add New Item
              </button>
            </div>

            {/* Add Item Form */}
            {showAddItemForm && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Inventory Item</h3>
                <form onSubmit={handleAddInventoryItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Chicken, Rice"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="g">Grams (g)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="ml">Milliliters (ml)</option>
                      <option value="l">Liters (l)</option>
                      <option value="pcs">Pieces (pcs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="10"
                    />
                  </div>
                  <div className="md:col-span-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddItemForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                    >
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Inventory Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventory.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{formatQuantity(item.quantity, item.unit)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getInventoryStatusColor(item.status)} flex items-center w-fit`}>
                          {item.status === 'out of stock' && <AlertCircle size={14} className="mr-1" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Amount"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            value={reduceAmounts[`${item._id}_amount`] || ''}
                            onChange={(e) => setReduceAmounts({
                              ...reduceAmounts,
                              [`${item._id}_amount`]: parseFloat(e.target.value) || ''
                            })}
                          />
                          <select
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            value={reduceAmounts[`${item._id}_unit`] || 'g'}
                            onChange={(e) => setReduceAmounts({
                              ...reduceAmounts,
                              [`${item._id}_unit`]: e.target.value
                            })}
                          >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                          </select>
                          <button
                            onClick={() => {
                              const amount = reduceAmounts[`${item._id}_amount`];
                              const unit = reduceAmounts[`${item._id}_unit`] || 'g';
                              if (amount && amount > 0) {
                                updateInventoryQuantity(item._id, amount, unit, 'add');
                                setReduceAmounts({
                                  ...reduceAmounts, 
                                  [`${item._id}_amount`]: '',
                                  [`${item._id}_unit`]: 'g'
                                });
                              }
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium disabled:bg-gray-300"
                            disabled={!reduceAmounts[`${item._id}_amount`] || reduceAmounts[`${item._id}_amount`] <= 0}
                          >
                            <Plus size={14} className="mr-1" />
                            Add
                          </button>
                          <button
                            onClick={() => {
                              const amount = reduceAmounts[`${item._id}_amount`];
                              const unit = reduceAmounts[`${item._id}_unit`] || 'g';
                              if (amount && amount > 0) {
                                updateInventoryQuantity(item._id, amount, unit, 'reduce');
                                setReduceAmounts({
                                  ...reduceAmounts, 
                                  [`${item._id}_amount`]: '',
                                  [`${item._id}_unit`]: 'g'
                                });
                              }
                            }}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded font-medium disabled:bg-gray-300"
                            disabled={!reduceAmounts[`${item._id}_amount`] || reduceAmounts[`${item._id}_amount`] <= 0}
                          >
                            <Minus size={14} className="mr-1" />
                            Use
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}