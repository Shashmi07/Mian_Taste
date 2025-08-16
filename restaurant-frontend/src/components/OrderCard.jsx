import React from 'react';
import { Clock, CheckCircle, Play, Users } from 'lucide-react';

export default function OrderCard({ order, onAccept, onUpdateStatus, onUpdateCookingStatus }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-orange-200 bg-orange-50',
      accepted: 'border-blue-200 bg-blue-50',
      ready: 'border-green-200 bg-green-50',
      delivered: 'border-gray-200 bg-gray-50'
    };
    return colors[status] || 'border-gray-200 bg-white';
  };

  const getProgress = (cookingStatus) => {
    const statusMap = {
      'not started': 0,
      'preparing': 25,
      'cooking': 50,
      'plating': 75,
      'ready': 100
    };
    return statusMap[cookingStatus] || 0;
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(order._id);
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(order._id, newStatus);
    }
  };

  const handleCookingStatusUpdate = (newCookingStatus) => {
    if (onUpdateCookingStatus) {
      onUpdateCookingStatus(order._id, newCookingStatus);
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${getStatusColor(order.status)}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{order.orderId || `Order #${order._id?.slice(-4)}`}</h3>
          <p className="text-sm text-gray-600">{order.table} • {order.customerName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{order.orderTime}</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
            order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
            order.status === 'ready' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-semibold mb-1">Items:</h4>
        <ul className="text-sm text-gray-700">
          {order.items?.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>Rs.{item.price}</span> {/* Changed from ₹{item.price} */}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="font-bold">Total: Rs.{order.totalAmount}</span> {/* Changed from ₹{order.totalAmount} */}
        <span className="text-sm text-gray-600 flex items-center">
          <Clock size={14} className="mr-1" />
          {order.estimatedTime}
        </span>
      </div>

      {/* Cooking Progress */}
      {order.status === 'accepted' && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{order.cookingStatus || 'not started'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress(order.cookingStatus)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-medium text-sm flex items-center justify-center"
          >
            <Play size={14} className="mr-1" />
            Accept Order
          </button>
        )}

        {order.status === 'accepted' && (
          <>
            {order.cookingStatus === 'not started' && (
              <button
                onClick={() => handleCookingStatusUpdate('preparing')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded font-medium text-sm"
              >
                Start Preparing
              </button>
            )}
            {order.cookingStatus === 'preparing' && (
              <button
                onClick={() => handleCookingStatusUpdate('cooking')}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded font-medium text-sm"
              >
                Start Cooking
              </button>
            )}
            {order.cookingStatus === 'cooking' && (
              <button
                onClick={() => handleCookingStatusUpdate('plating')}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded font-medium text-sm"
              >
                Start Plating
              </button>
            )}
            {order.cookingStatus === 'plating' && (
              <button
                onClick={() => handleStatusUpdate('ready')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-medium text-sm flex items-center justify-center"
              >
                <CheckCircle size={14} className="mr-1" />
                Mark Ready
              </button>
            )}
          </>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => handleStatusUpdate('delivered')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded font-medium text-sm flex items-center justify-center"
          >
            <Users size={14} className="mr-1" />
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}