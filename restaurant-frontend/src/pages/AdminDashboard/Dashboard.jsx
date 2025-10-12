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
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    preset: 'last30days'
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Try new date range format first, fallback to days format
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      const daysDiff = Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));

      // Try the new format first
      let response = await fetch(`${API_URL}/admin-analytics/data?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // If that fails, try the old format
      if (!response.ok) {
        console.log('New API format failed, trying legacy format...');
        response = await fetch(`${API_URL}/admin-analytics/data?days=${daysDiff}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Analytics API Response:', data); // Debug log
        setAnalyticsData(data.data || data); // Handle different response formats
      } else {
        console.error('API Error:', response.status, await response.text());
        // Set empty data structure to prevent errors
        setAnalyticsData({
          dailySales: [],
          ordersSummary: [],
          hourlyAnalysis: Array.from({length: 24}, (_, i) => ({ hour: i, orderCount: 0, revenue: 0 })),
          foodItems: []
        });
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

  // Date range preset functions
  const setPresetRange = (preset) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let startDate, endDate;
    
    switch(preset) {
      case 'today':
        startDate = endDate = new Date(today);
        break;
      case 'yesterday':
        startDate = endDate = new Date(yesterday);
        break;
      case 'last7days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date(today);
        break;
      case 'last30days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date(today);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }
    
    setDateRange({ startDate, endDate, preset });
    setShowCustomRange(false);
  };

  const handleCustomDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: new Date(value),
      preset: 'custom'
    }));
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateRange = () => {
    // Show preset names instead of dates for better UX
    const presetLabels = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'last7days': 'Last 7 Days',
      'last30days': 'Last 30 Days'
    };
    
    if (dateRange.preset && presetLabels[dateRange.preset]) {
      return presetLabels[dateRange.preset];
    }
    
    // For custom ranges, show actual dates
    const start = dateRange.startDate.toLocaleDateString();
    const end = dateRange.endDate.toLocaleDateString();
    
    if (start === end) {
      return start;
    }
    return `${start} - ${end}`;
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
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-[#46923c] to-[#5BC142] rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Real-time restaurant performance insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCustomRange(!showCustomRange)}
              className="flex items-center justify-between w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <span className="text-sm text-gray-700">{formatDateRange()}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCustomRange ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showCustomRange && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {/* Quick Presets */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'today', label: 'Today' },
                      { key: 'yesterday', label: 'Yesterday' },
                      { key: 'last7days', label: 'Last 7 Days' },
                      { key: 'last30days', label: 'Last 30 Days' }
                    ].map(preset => (
                      <button
                        key={preset.key}
                        onClick={() => setPresetRange(preset.key)}
                        className={`px-3 py-2 text-sm rounded text-left ${
                          dateRange.preset === preset.key
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formatDateForInput(dateRange.startDate)}
                        onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formatDateForInput(dateRange.endDate)}
                        onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => setShowCustomRange(false)}
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setDateRange(prev => ({ ...prev, preset: 'custom' }));
                          setShowCustomRange(false);
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Modern KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-[#46923c] to-[#5BC142] rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatLKR(totalRevenue)}</p>
              <p className="text-green-100 text-xs mt-1">↗ +12% vs last period</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
              <p className="text-blue-600 text-xs mt-1 font-medium">🔥 Peak: 7-9 PM</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Unique Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueCustomers}</p>
              <p className="text-purple-600 text-xs mt-1 font-medium">👥 +8 new today</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Average Order Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Order</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatLKR(averageOrder)}</p>
              <p className="text-orange-600 text-xs mt-1 font-medium">📈 +5% this week</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <TrendingUp className="w-8 h-8 text-orange-600" />
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
    </div>
  );
};

export default Dashboard;