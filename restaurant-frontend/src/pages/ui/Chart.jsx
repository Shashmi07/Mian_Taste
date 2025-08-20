import React from 'react';

const Chart = ({ range = '30d' }) => {
  // Mock chart data - in a real app, this would come from your backend
  const generateMockData = () => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      revenue: Math.floor(Math.random() * 50000) + 20000
    }));
  };

  const data = generateMockData();
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="relative">
      <div className="h-64 flex items-end justify-between">
        {data.map((point, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-colors cursor-pointer group relative"
            style={{
              height: `${(point.revenue / maxRevenue) * 100}%`,
              width: `${Math.max(100 / data.length - 1, 2)}%`
            }}
          >
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Rs {point.revenue.toLocaleString()}
              <br />
              {point.date}
            </div>
          </div>
        ))}
      </div>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-12">
        <span>Rs {maxRevenue.toLocaleString()}</span>
        <span>Rs {Math.floor(maxRevenue * 0.75).toLocaleString()}</span>
        <span>Rs {Math.floor(maxRevenue * 0.5).toLocaleString()}</span>
        <span>Rs {Math.floor(maxRevenue * 0.25).toLocaleString()}</span>
        <span>Rs 0</span>
      </div>
    </div>
  );
};

export default Chart;
