import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Clock,
  Calendar,
  ChefHat,
  Package
} from 'lucide-react';
import StatCard from '../ui/StatCard';
import Chart from '../ui/Chart';

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: '₹45,231', change: '+12%', icon: DollarSign, color: 'green' },
    { title: 'Active Orders', value: '23', change: '+3', icon: ShoppingCart, color: 'blue' },
    { title: 'Total Customers', value: '1,234', change: '+8%', icon: Users, color: 'purple' },
    { title: 'Table Reservations', value: '18', change: '+5', icon: Calendar, color: 'orange' },
  ];

  const recentOrders = [
    { id: '#001', customer: 'Raj Patel', items: '2x Tonkotsu, 1x Gyoza', amount: '₹1,899', status: 'Preparing', time: '10:30 AM' },
    { id: '#002', customer: 'Priya Sharma', items: '1x Ramen, 2x Juice', amount: '₹1,250', status: 'Ready', time: '10:25 AM' },
    { id: '#003', customer: 'Arjun Singh', items: '1x Rice Bowl, 1x Tea', amount: '₹899', status: 'Delivered', time: '10:20 AM' },
    { id: '#004', customer: 'Meera Gupta', items: '3x Sushi, 1x Sake', amount: '₹2,175', status: 'Preparing', time: '10:15 AM' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Preparing': return 'status-badge warning';
      case 'Ready': return 'status-badge success';
      case 'Delivered': return 'status-badge info';
      default: return 'status-badge info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at Grand Minato.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="chart-title">Revenue Overview</h3>
          <Chart />
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200">
              <ChefHat className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-800">Add Menu Item</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200">
              <Package className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-800">Update Inventory</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all duration-200">
              <Calendar className="w-6 h-6 text-orange-600" />
              <span className="font-medium text-gray-800">View Reservations</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200">
              <Users className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-800">Manage Users</span>
            </button>
          </div>
        </div>
      </div>

      <div className="data-table">
        <div className="p-6 border-b border-green-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-gray-800">{order.id}</td>
                  <td className="text-gray-600">{order.customer}</td>
                  <td className="text-gray-600">{order.items}</td>
                  <td className="font-semibold text-gray-800">{order.amount}</td>
                  <td>
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-gray-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;