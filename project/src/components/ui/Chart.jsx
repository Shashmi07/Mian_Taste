import React from 'react';

const Chart = () => {
  const data = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 52 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 92 },
    { day: 'Sat', value: 98 },
    { day: 'Sun', value: 74 }
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full bg-green-50 rounded-t relative" style={{ height: '200px' }}>
              <div
                className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-full absolute bottom-0 transition-all duration-500 ease-out"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm font-medium text-gray-600 mt-2">{item.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;