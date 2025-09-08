import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, User, Phone, MapPin } from 'lucide-react';

const OrderManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { id: 'all', name: 'All Orders', count: orders.length },
    { id: 'pending', name: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'preparing', name: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', name: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { id: 'completed', name: 'Completed', count: orders.filter(o => o.status === 'completed').length }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-badge warning';
      case 'preparing': return 'status-badge info';
      case 'ready': return 'status-badge success';
      case 'completed': return 'status-badge info';
      case 'cancelled': return 'status-badge error';
      default: return 'status-badge info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'dine-in': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800';
      case 'takeaway': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
      case 'delivery': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'qr-order': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getOrderTypeDisplayName = (type) => {
    switch (type) {
      case 'dine-in': return 'Dine In';
      case 'takeaway': return 'Takeaway';
      case 'delivery': return 'Delivery';
      case 'qr-order': return 'QR Order';
      default: return type;
    }
  };

  const isScheduledOrder = (order) => {
    return order.scheduledDate && order.scheduledTime;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-600">Track and manage customer orders in real-time</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {statusFilters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              selectedFilter === filter.id
                ? 'btn-primary'
                : 'bg-white text-gray-700 border-green-200 hover:bg-green-50'
            }`}
          >
            <span>{filter.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedFilter === filter.id
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-600'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order._id || order.id} className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{order.orderId || order.id}</h3>
                  <p className="text-sm text-gray-500">{order.orderTime}</p>
                  {isScheduledOrder(order) && (
                    <p className="text-sm text-blue-600 font-medium">
                      📅 Scheduled: {new Date(order.scheduledDate).toLocaleDateString()} at {order.scheduledTime}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(order.orderType || order.type)}`}>
                    {getOrderTypeDisplayName(order.orderType || order.type)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800 font-medium">{order.customerName}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">{order.customerPhone}</span>
                  </div>
                )}
                {order.table && order.table !== 'TAKEAWAY-ORDER' && order.table !== 'DELIVERY-ORDER' && (
                  <div className="text-sm text-gray-600">
                    {order.table.startsWith('Table') ? order.table : `Table ${order.table}`}
                  </div>
                )}
                {order.deliveryAddress && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600 text-sm">{order.deliveryAddress}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-green-100 pt-4 mb-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Order Items</h4>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-800">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-green-600">Total: ₹{order.totalAmount || order.total}</span>
                {order.estimatedTime && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{order.estimatedTime}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button className="flex-1 btn-primary py-2 px-3 text-sm">
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button className="flex-1 btn-primary py-2 px-3 text-sm">
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Complete Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400">Orders will appear here as they come in</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;