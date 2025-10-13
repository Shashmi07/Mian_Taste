import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Search, Filter, CheckCircle, Eye, RotateCcw, XCircle } from 'lucide-react';

const TableReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); // Empty by default - show all dates
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_URL}/table-reservations`;
      const params = new URLSearchParams();
      
      if (selectedDate) {
        params.append('date', selectedDate);
      }
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.reservations);
      } else {
        setError(data.message || 'Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status (only to completed)
  const markAsCompleted = async (reservationId) => {
    try {
      const response = await fetch(`${API_URL}/table-reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh reservations
        await fetchReservations();
        return true;
      } else {
        setError(data.message || 'Failed to update reservation');
        return false;
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError('Failed to update reservation');
      return false;
    }
  };

  // Cancel reservation
  const cancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? The customer will be notified.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/table-reservations/${reservationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Reservation cancelled successfully. Customer has been notified.');
        fetchReservations(); // Refresh reservations
      } else {
        alert(data.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    }
  };

  // Get status styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(reservation =>
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load reservations on component mount and when filters change
  useEffect(() => {
    fetchReservations();
  }, [selectedDate, selectedStatus]);

  const handleMarkAsCompleted = async (reservationId) => {
    if (window.confirm('Mark this reservation as completed?')) {
      await markAsCompleted(reservationId);
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Table Reservation Management
          </h1>
          <p className="text-gray-600">Manage customer table reservations</p>
        </div>
        <button
          onClick={fetchReservations}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Filter by Date (optional)
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input w-full"
              placeholder="Leave empty to show all dates"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select w-full"
            >
              <option value="all">All Reservations</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search Reservations
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="form-input w-full"
            />
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="text-center py-12">
            <RotateCcw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reservations found</p>
            <p className="text-gray-400">Try adjusting your filters or date range</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tables
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {reservation.reservationId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {reservation.customerName}
                        </div>
                        <div className="text-xs text-gray-500 truncate" style={{maxWidth: '120px'}}>
                          {reservation.customerEmail}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatDate(reservation.reservationDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {reservation.selectedTables.sort().join(', ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.hasFood ? (
                            <span className="text-orange-600">
                              +{reservation.foodItems?.length || 0} items
                            </span>
                          ) : (
                            <span>Table only</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        Rs.{reservation.grandTotal || reservation.tableTotal || 0}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewDetails(reservation)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {reservation.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleMarkAsCompleted(reservation.reservationId)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => cancelReservation(reservation.reservationId)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Cancel Reservation"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Reservation Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reservation ID</label>
                <p className="text-sm text-gray-900">{selectedReservation.reservationId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReservation.status)}`}>
                  {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <p className="text-sm text-gray-900">{selectedReservation.customerName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{selectedReservation.customerPhone}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{selectedReservation.customerEmail}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-sm text-gray-900">
                  {formatDate(selectedReservation.reservationDate)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <p className="text-sm text-gray-900">{selectedReservation.timeSlot}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tables</label>
                <p className="text-sm text-gray-900">
                  {selectedReservation.selectedTables.sort().join(', ')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created On</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedReservation.createdAt).toLocaleString()}
                </p>
              </div>
              
              {/* Special Requests */}
              {selectedReservation.specialRequests && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedReservation.specialRequests}</p>
                </div>
              )}

              {/* Food Orders Section */}
              {selectedReservation.hasFood && selectedReservation.foodItems && selectedReservation.foodItems.length > 0 ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Orders</label>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedReservation.foodItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-900">{item.name}</span>
                          <div className="text-sm text-gray-600">
                            {item.quantity}x Rs.{item.price} = Rs.{item.quantity * item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-orange-200 mt-3 pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Food Total:</span>
                        <span>Rs.{selectedReservation.foodTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Table reservation only (no food orders)</p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Summary</label>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Table Reservation ({selectedReservation.selectedTables?.length} tables):</span>
                      <span>Rs.{selectedReservation.tableTotal || 0}</span>
                    </div>
                    {selectedReservation.hasFood && (
                      <div className="flex justify-between text-sm">
                        <span>Food Orders:</span>
                        <span>Rs.{selectedReservation.foodTotal || 0}</span>
                      </div>
                    )}
                    <div className="border-t border-green-200 pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Grand Total:</span>
                        <span className="text-green-600">Rs.{selectedReservation.grandTotal || selectedReservation.tableTotal || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableReservation;
