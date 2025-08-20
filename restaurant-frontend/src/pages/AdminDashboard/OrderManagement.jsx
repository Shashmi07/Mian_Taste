import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, User, Phone, MapPin } from 'lucide-react';

const OrderManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [orders] = useState([
    {
      id: 'ORD-001',
      customerName: 'Raj Patel',
      customerPhone: '+91 98765 43210',
      items: [
        { name: 'Tonkotsu Ramen', quantity: 1, price: 1500 },
        { name: 'Gyoza', quantity: 1, price: 650 }
      ],
      total: 2150,
      type: 'dine-in',
      status: 'preparing',
      orderTime: '10:30 AM',
      estimatedTime: '15 mins',
      tableNumber: 12
    },
    {
      id: 'ORD-002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      items: [
        { name: 'Chicken Teriyaki', quantity: 2, price: 1200 },
        { name: 'Miso Soup', quantity: 2, price: 350 }
      ],
      total: 3100,
      type: 'takeaway',
      status: 'ready',
      orderTime: '10:25 AM',
      estimatedTime: 'Ready'
    },
    {
      id: 'ORD-003',
      customerName: 'Arjun Singh',
      customerPhone: '+91 76543 21098',
      items: [
        { name: 'Sushi Platter', quantity: 1, price: 2200 },
        { name: 'Green Tea', quantity: 2, price: 200 }
      ],
      total: 2600,
      type: 'delivery',
      status: 'pending',
      orderTime: '10:20 AM',
      estimatedTime: '30 mins',
      address: '123 MG Road, Bangalore'
    }
  ]);

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
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.orderTime}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(order.type)}`}>
                    {order.type.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800 font-medium">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-sm">{order.customerPhone}</span>
                </div>
                {order.tableNumber && (
                  <div className="text-sm text-gray-600">Table #{order.tableNumber}</div>
                )}
                {order.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600 text-sm">{order.address}</span>
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
                <span className="text-lg font-bold text-green-600">Total: ₹{order.total}</span>
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

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400">Orders will appear here as they come in</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;