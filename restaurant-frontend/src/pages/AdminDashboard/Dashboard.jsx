import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  RefreshCw,
  Clock,
  Star,
  ChefHat,
  Package,
  AlertCircle,
} from 'lucide-react';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('30d');

  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAnalyticsData();
  }, [range]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
      
      const response = await fetch(`${baseUrl}/api/admin-analytics/powerbi-data?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  // Calculate key metrics
  const totalRevenue = analyticsData?.dailySales?.reduce((sum, day) => sum + day.totalRevenue, 0) || 0;
  const totalOrders = analyticsData?.ordersSummary?.length || 0;
  const uniqueCustomers = analyticsData?.ordersSummary ? 
    new Set(analyticsData.ordersSummary.map(o => o.customerName || o.customerEmail).filter(Boolean)).size : 0;
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get peak hour
  const hourlyData = analyticsData?.hourlyAnalysis || [];
  const peakHour = hourlyData.reduce((acc, curr, index) => 
    curr.orderCount > (hourlyData[acc]?.orderCount || 0) ? index : acc, 0);

  // Top items
  const topItems = analyticsData?.foodItems
    ?.sort((a, b) => b.totalQuantity - a.totalQuantity)
    ?.slice(0, 5) || [];

  // Format currency
  const formatLKR = (amount) => `Rs ${Math.round(amount).toLocaleString()}/=`;

  // Get hour label
  const getHourLabel = (hour) => {
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-500 text-lg mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Restaurant analytics and business insights</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Time Range Filter */}
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-green-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatLKR(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueCustomers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Order</p>
              <p className="text-2xl font-bold text-gray-900">{formatLKR(averageOrder)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Business Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-green-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Peak Hour</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{getHourLabel(peakHour)}</p>
          <p className="text-sm text-gray-500">{hourlyData[peakHour]?.orderCount || 0} orders</p>
        </div>

        <div className="bg-white rounded-lg border border-green-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <ChefHat className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Top Seller</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{topItems[0]?.itemName || 'No data'}</p>
          <p className="text-sm text-gray-500">{topItems[0]?.totalQuantity || 0} sold</p>
        </div>

        <div className="bg-white rounded-lg border border-green-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Order Types</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>QR Orders</span>
              <span className="font-medium">{analyticsData?.dailySales?.reduce((sum, day) => sum + day.qrOrders, 0) || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pre-Orders</span>
              <span className="font-medium">{analyticsData?.dailySales?.reduce((sum, day) => sum + day.preOrders, 0) || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Feedback</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {analyticsData?.customerFeedback?.length 
              ? (analyticsData.customerFeedback.reduce((sum, fb) => sum + fb.averageRating, 0) / analyticsData.customerFeedback.length).toFixed(1)
              : '0.0'
            }
          </p>
          <p className="text-sm text-gray-500">{analyticsData?.customerFeedback?.length || 0} reviews</p>
        </div>
      </div>

      {/* Top Menu Items */}
      <div className="bg-white rounded-lg border border-green-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
              <p className="text-gray-600 text-sm">Best performing menu items this period</p>
            </div>
            <ChefHat className="w-6 h-6 text-green-600" />
          </div>
        </div>
        
        <div className="p-6">
          {topItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sales data available</p>
          ) : (
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.itemName}</p>
                      <p className="text-sm text-gray-500">Revenue: {formatLKR(item.totalRevenue)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{item.totalQuantity}</p>
                    <p className="text-sm text-gray-500">orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="bg-white rounded-lg border border-green-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
              <p className="text-gray-600 text-sm">Items that may need restocking</p>
            </div>
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        
        <div className="p-6">
          {!analyticsData?.inventoryRecommendations || analyticsData.inventoryRecommendations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No inventory recommendations available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.inventoryRecommendations.slice(0, 6).map((item, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      Alert
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Daily Average:</span>
                      <span className="font-medium">{item.dailyAverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reorder Level:</span>
                      <span className="font-medium text-orange-600">{item.reorderLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended Stock:</span>
                      <span className="font-bold text-gray-900">{item.recommendedStock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;