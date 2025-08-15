import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    green: 'text-green-600 bg-gradient-to-r from-green-400 to-green-500',
    blue: 'text-blue-600 bg-gradient-to-r from-blue-400 to-blue-500',
    purple: 'text-purple-600 bg-gradient-to-r from-purple-400 to-purple-500',
    orange: 'text-orange-600 bg-gradient-to-r from-orange-400 to-orange-500'
  };

  const changeColorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`stat-card-icon ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="stat-card-value">{value}</div>
          <div className={`stat-card-change ${changeColorClasses[color]}`}>
            {change}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;