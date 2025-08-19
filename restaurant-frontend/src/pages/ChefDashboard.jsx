import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, ChefHat, Timer, Eye, Minus, Bell, Users, Plus, AlertCircle } from 'lucide-react';
import { ordersAPI, inventoryAPI } from '../services/api';
import socketService from '../services/socket';
import OrderCard from '../components/OrderCard';

export default function ChefDashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [reduceAmounts, setReduceAmounts] = useState({});
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('all');
  const [showAddItemForm, setShowAddItemForm] = useState(false);
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

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getInventory();
      setInventory(response.data.inventory || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setInventory([]);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      console.log('Accepting order:', orderId);
      const response = await ordersAPI.acceptOrder(orderId);
      console.log('Accept response:', response.data);
      
      if (response.data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? response.data.order : order
        ));
        
        // Automatically switch to active orders tab for seamless workflow
        setSelectedOrderFilter('active');
        
        // Optional: Show a brief success message
        setTimeout(() => {
          console.log('Order accepted successfully. Switched to Active Orders tab.');
        }, 100);
      } else {
        alert('Failed to accept order: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      console.log('Updating order status:', orderId, status);
      const response = await ordersAPI.updateOrderStatus(orderId, { status });
      console.log('Status response:', response.data);
      
      if (response.data.success) {
        // Fix: Missing parenthesis in map function
        setOrders(prev => prev.map(order => 
          order._id === orderId ? response.data.order : order
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
        alert('Failed to update status: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateCookingStatus = async (orderId, cookingStatus) => {
    try {
      console.log('Updating cooking status:', orderId, cookingStatus);
      const response = await ordersAPI.updateOrderStatus(orderId, { cookingStatus });
      console.log('Cooking status response:', response.data);
      
      if (response.data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? response.data.order : order
        ));
      } else {
        alert('Failed to update cooking status: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating cooking status:', error);
      alert('Failed to update cooking status: ' + (error.response?.data?.message || error.message));
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg">
                <ChefHat className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Chef Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              </button>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user?.name || 'Chef'}</p>
                <p className="text-sm text-gray-500">{user?.role || 'Kitchen Manager'}</p>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('pending');
            }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('active');
            }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'accepted' || o.status === 'preparing' || o.status === 'finished').length}
                </p>
              </div>
              <ChefHat className="text-blue-500" size={24} />
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('ready');
            }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready for Service</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'ready').length} {/* Changed from 'ready for pickup' */}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrderFilter('completed');
            }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <Users className="text-purple-500" size={24} />
            </div>
          </button>
        </div>

        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 border border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-md font-medium text-center ${
              activeTab === 'orders'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Clock className="inline mr-2" size={16} />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-4 rounded-md font-medium text-center ${
              activeTab === 'inventory'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Package className="inline mr-2" size={16} />
            Inventory
          </button>
        </div>

        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
              <select 
                value={selectedOrderFilter}
                onChange={(e) => setSelectedOrderFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="ready">Ready for Service</option>
                <option value="completed">Completed</option>
              </select>
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kitchen Inventory</h2>
              <button
                onClick={() => setShowAddItemForm(!showAddItemForm)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Plus size={16} className="mr-2" />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
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
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
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
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded font-medium disabled:bg-gray-300"
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