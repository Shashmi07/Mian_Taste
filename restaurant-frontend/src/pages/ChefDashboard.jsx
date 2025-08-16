import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, ChefHat, Timer, Eye, Minus, Bell, Users, Plus, AlertCircle } from 'lucide-react';
import { ordersAPI, inventoryAPI } from '../services/api';
import socketService from '../services/socket';

export default function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [reduceAmounts, setReduceAmounts] = useState({});
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('all');

  useEffect(() => {
    // Load initial data
    loadOrders();
    loadInventory();

    // Connect to socket for real-time updates
    socketService.connect(); // Remove the 'const socket =' part

    // Listen for real-time updates
    socketService.onNewOrder((newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });

    socketService.onOrderUpdate((updatedOrder) => {
      setOrders(prev => prev.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      ));
    });

    socketService.onInventoryUpdate((updatedItem) => {
      setInventory(prev => prev.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getInventory();
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const response = await ordersAPI.acceptOrder(orderId);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.order : order
      ));
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const updateOrderStatus = async (orderId, status, cookingStatus = null) => {
    try {
      const data = {};
      if (status) data.status = status;
      if (cookingStatus) data.cookingStatus = cookingStatus;

      const response = await ordersAPI.updateOrderStatus(orderId, data);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.order : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const updateInventoryQuantity = async (itemId, amount, unit, operation) => {
    try {
      await inventoryAPI.updateQuantity(itemId, { operation, amount, unit });
      // The socket will handle the update, but we can also reload
      loadInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  // Unit conversion helper functions
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
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
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

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-gray-900">{order.orderNumber || order._id}</h3>
          <p className="text-gray-700">{order.table} • {order.customerName}</p>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Clock size={14} className="mr-1" />
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <ChefHat size={16} className="mr-2 text-orange-500" />
          Items:
        </h4>
        <ul className="space-y-1">
          {order.items.map((item, index) => (
            <li key={index} className="flex items-center bg-gray-50 rounded p-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span className="text-gray-700">{item.name || item}</span>
              {item.quantity && <span className="ml-auto text-gray-500">x{item.quantity}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mb-4 bg-gray-50 rounded-lg p-3">
        <span className="font-bold text-xl text-green-700">Rs.{order.totalAmount}</span>
        <div className="flex items-center text-sm text-gray-600">
          <Timer size={16} className="mr-1 text-blue-500" />
          Est: {order.estimatedTime || '20 min'}
        </div>
      </div>

      {/* Order Status Tracking */}
      {order.status === 'accepted' && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <CheckCircle size={16} className="mr-2 text-blue-500" />
            Progress:
          </h4>
          <div className="flex justify-between items-center space-x-2">
            <button
              onClick={() => updateOrderStatus(order._id, null, 'started')}
              className={`px-4 py-2 rounded font-medium text-sm ${
                order.cookingStatus === 'started' || order.cookingStatus === 'preparing' || order.cookingStatus === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Started
            </button>
            <div className={`h-1 flex-1 mx-2 rounded ${
              order.cookingStatus === 'preparing' || order.cookingStatus === 'completed'
                ? 'bg-blue-400'
                : 'bg-gray-300'
            }`}></div>
            <button
              onClick={() => updateOrderStatus(order._id, null, 'preparing')}
              className={`px-4 py-2 rounded font-medium text-sm ${
                order.cookingStatus === 'preparing' || order.cookingStatus === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              disabled={order.cookingStatus !== 'started' && order.cookingStatus !== 'preparing' && order.cookingStatus !== 'completed'}
            >
              Preparing
            </button>
            <div className={`h-1 flex-1 mx-2 rounded ${
              order.cookingStatus === 'completed'
                ? 'bg-purple-400'
                : 'bg-gray-300'
            }`}></div>
            <button
              onClick={() => updateOrderStatus(order._id, null, 'completed')}
              className={`px-4 py-2 rounded font-medium text-sm ${
                order.cookingStatus === 'completed'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              disabled={order.cookingStatus !== 'preparing' && order.cookingStatus !== 'completed'}
            >
              Completed
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => acceptOrder(order._id)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-medium"
          >
            Accept Order
          </button>
        )}

        {order.status === 'accepted' && order.cookingStatus === 'completed' && (
          <button
            onClick={() => updateOrderStatus(order._id, 'ready')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium"
          >
            Mark Ready
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => updateOrderStatus(order._id, 'delivered')}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded font-medium"
          >
            Delivered
          </button>
        )}

        <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
          <Eye size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );

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
                <p className="font-semibold text-gray-900">Chef Maria</p>
                <p className="text-sm text-gray-500">Kitchen Manager</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Stats Overview */}
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
                  {orders.filter(o => o.status === 'accepted').length}
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
                <p className="text-sm text-gray-600">Ready Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'ready').length}
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

        {/* Tab Navigation */}
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

        {/* Orders Tab */}
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
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders
                .filter(order => {
                  if (selectedOrderFilter === 'all') return true;
                  if (selectedOrderFilter === 'pending') return order.status === 'pending';
                  if (selectedOrderFilter === 'active') return order.status === 'accepted';
                  if (selectedOrderFilter === 'ready') return order.status === 'ready';
                  if (selectedOrderFilter === 'completed') return order.status === 'delivered';
                  return false;
                })
                .map(order => (
                  <OrderCard key={order._id} order={order} />
                ))}
            </div>

            {orders.filter(order => {
              if (selectedOrderFilter === 'all') return true;
              if (selectedOrderFilter === 'pending') return order.status === 'pending';
              if (selectedOrderFilter === 'active') return order.status === 'accepted';
              if (selectedOrderFilter === 'ready') return order.status === 'ready';
              if (selectedOrderFilter === 'completed') return order.status === 'delivered';
              return false;
            }).length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No {selectedOrderFilter === 'all' ? '' : selectedOrderFilter} orders
                </h3>
                <p className="text-gray-500">
                  {selectedOrderFilter === 'pending' && 'No new orders waiting.'}
                  {selectedOrderFilter === 'active' && 'No orders being prepared.'}
                  {selectedOrderFilter === 'ready' && 'No orders ready for pickup.'}
                  {selectedOrderFilter === 'completed' && 'No completed orders.'}
                  {selectedOrderFilter === 'all' && 'No orders at the moment.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kitchen Inventory</h2>
              <p className="text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
                Enter amount in kg or g
              </p>
            </div>

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
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={reduceAmounts[`${item._id}_amount`] || ''}
                            onChange={(e) => setReduceAmounts({
                              ...reduceAmounts,
                              [`${item._id}_amount`]: parseFloat(e.target.value) || ''
                            })}
                          />
                          <select
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
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
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
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

            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Items</p>
                    <p className="text-2xl font-bold text-green-600">
                      {inventory.filter(item => item.status === 'available').length}
                    </p>
                  </div>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {inventory.filter(item => item.status === 'low').length}
                    </p>
                  </div>
                  <AlertCircle className="text-yellow-500" size={24} />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                      {inventory.filter(item => item.status === 'out of stock').length}
                    </p>
                  </div>
                  <Package className="text-red-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}