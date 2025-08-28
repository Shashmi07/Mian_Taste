import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { createReservation, checkAvailability } from '../services/tableReservationAPI';
import { useCart } from '../context/CartContext';


// Table pricing constant
const TABLE_PRICE_PER_TABLE = 500;

export default function TableReservation() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTables, setAvailableTables] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [loading, setLoading] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  

  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  const today = new Date().toISOString().split('T')[0];

  // Clear cart only when starting fresh table reservation (not when coming from menu)
  useEffect(() => {
    try {
      const hasReservationContext = localStorage.getItem('reservationContext');
      if (!hasReservationContext && clearCart) {
        clearCart();
      }
    } catch (error) {
      console.error('Error clearing cart on mount:', error);
    }
  }, []); // Run only once on mount

  // Check availability when date or time slot changes
  const checkTableAvailability = async () => {
    if (!selectedDate || !selectedTimeSlot) return;
    
    try {
      setLoading(true);
      console.log(`🔍 Checking availability for ${selectedDate} at ${selectedTimeSlot}`);
      const response = await checkAvailability(selectedDate, selectedTimeSlot);
      console.log('📋 Availability response:', response);
      
      if (response.success) {
        console.log(`✅ Available tables: [${response.availableTables.join(', ')}]`);
        console.log(`❌ Reserved tables: [${response.reservedTables?.join(', ') || 'none'}]`);
        setAvailableTables(response.availableTables);
        
        // Clear selected tables if they're no longer available
        const previouslySelected = selectedTables.filter(tableId => !response.availableTables.includes(tableId));
        if (previouslySelected.length > 0) {
          console.log(`⚠️ Removing unavailable selected tables: [${previouslySelected.join(', ')}]`);
          alert(`⚠️ Tables ${previouslySelected.join(', ')} are no longer available and have been deselected.`);
          setSelectedTables(prev => prev.filter(tableId => response.availableTables.includes(tableId)));
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      // Don't show alert on mobile - just log and continue with default tables
      if (!/Mobi|Android/i.test(navigator.userAgent)) {
        alert('Error checking table availability. Please try again.');
      }
      // Keep all tables available as fallback
      setAvailableTables([1, 2, 3, 4, 5, 6, 7, 8]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      const timeoutId = setTimeout(() => {
        checkTableAvailability();
      }, 300); // Add small delay to prevent rapid calls
      
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedTimeSlot]);





  const handleTableSelect = (tableId) => {
    if (!availableTables.includes(tableId)) return;
    
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };


  const getTableTotal = () => {
    return selectedTables.length * TABLE_PRICE_PER_TABLE;
  };


  const handleReserve = async () => {
    // Check if user is logged in first
    const customerToken = localStorage.getItem('customerToken');
    const customerUser = localStorage.getItem('customerUser');
    
    if (!customerToken || !customerUser) {
      // Show a better styled confirmation dialog
      const shouldLogin = window.confirm(
        '🔐 Login Required\n\nPlease login to your account to make a table reservation.\n\nWould you like to go to the login page now?'
      );
      
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }
    
    // Validation - only check table selection, date, and time
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }
    if (selectedTables.length === 0) {
      alert('Please select at least one table');
      return;
    }

    try {
      setLoading(true);
      
      // Get customer info from localStorage
      const userData = JSON.parse(customerUser);
      console.log('Customer user data:', userData);
      
      const reservationData = {
        customerName: userData.username || '',
        customerEmail: userData.email || '',
        customerPhone: userData.phoneNumber || '',
        reservationDate: selectedDate,
        timeSlot: selectedTimeSlot,
        selectedTables: selectedTables,
        specialRequests: specialRequests,
        // Table-only reservation totals
        hasFood: false,
        foodItems: [],
        foodTotal: 0,
        tableTotal: getTableTotal(),
        grandTotal: getTableTotal()
      };
      
      console.log('Sending reservation data:', reservationData);

      const response = await createReservation(reservationData);
      
      if (response.success) {
        // Store reservation details for success display
        setReservationDetails({
          ...response.reservation,
          customerName: userData.username || '',
          selectedTables,
          selectedDate,
          selectedTimeSlot,
          totalAmount: getTableTotal()
        });
        
        // Show success state
        setReservationSuccess(true);
      } else {
        alert(response.message || 'Failed to create reservation. Please try again.');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(`Failed to create reservation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFoodOrders = () => {
    // Store reservation context for the menu
    localStorage.setItem('reservationContext', JSON.stringify({
      reservationId: reservationDetails.reservationId,
      customerName: reservationDetails.customerName,
      tableDetails: {
        tables: reservationDetails.selectedTables,
        date: reservationDetails.selectedDate,
        timeSlot: reservationDetails.selectedTimeSlot
      },
      tableAmount: reservationDetails.totalAmount
    }));
    
    // Navigate to menu
    navigate('/menu');
  };

  const handleProceedToPayment = () => {
    // Store reservation details for payment using the correct key that PaymentGateway expects
    localStorage.setItem('currentOrder', JSON.stringify({
      type: 'table-reservation',
      total: reservationDetails.totalAmount,
      customerName: reservationDetails.customerName,
      orderType: 'Table Reservation',
      reservationDetails: {
        reservationId: reservationDetails.reservationId,
        tables: reservationDetails.selectedTables,
        date: reservationDetails.selectedDate,
        timeSlot: reservationDetails.selectedTimeSlot
      },
      items: [
        {
          name: `Table Reservation (${reservationDetails.selectedTables.length} tables)`,
          quantity: 1,
          price: reservationDetails.totalAmount,
          description: `Tables: ${reservationDetails.selectedTables.join(', ')} | ${reservationDetails.selectedDate} | ${reservationDetails.selectedTimeSlot}`
        }
      ],
      createdAt: new Date().toISOString()
    }));
    
    // Navigate to payment gateway
    navigate('/payment');
  };


  const getTableButtonClass = (tableNum) => {
    const isSelected = selectedTables.includes(tableNum);
    const isAvailable = availableTables.includes(tableNum);
    
    if (isSelected) {
      return 'bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105';
    } else if (isAvailable) {
      return 'bg-green-500 border-green-600 text-white hover:bg-green-600 hover:shadow-md hover:transform hover:scale-105 active:bg-green-700';
    } else {
      return 'bg-red-500 border-red-600 text-white cursor-not-allowed opacity-80';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="relative h-32 flex items-center justify-center pt-24">
        <h1 className="text-gray-800 text-3xl font-bold tracking-wide drop-shadow-lg">
          Table Reservation
        </h1>
      </div>
      
      <div className="px-3 md:px-6 py-4 md:py-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto">
          {reservationSuccess ? (
            /* Reservation Success View */
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Table Reserved!</h2>
                <p className="text-gray-600 mb-6">Your table reservation is ready. Choose your next step:</p>
              </div>

              {/* Reservation Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-4 text-center">Reservation Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reservation ID:</span>
                    <span className="font-semibold text-red-600">{reservationDetails?.reservationId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Name:</span>
                    <span className="font-medium">{reservationDetails?.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {reservationDetails?.selectedDate && new Date(reservationDetails.selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{reservationDetails?.selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tables:</span>
                    <span className="font-medium">{reservationDetails?.selectedTables?.join(', ')}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-semibold">Total Amount:</span>
                      <span className="font-bold text-red-600 text-lg">Rs.{reservationDetails?.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAddFoodOrders}
                  className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  <UtensilsCrossed size={20} />
                  Add Food Orders
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  💳 Proceed to Payment
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                💡 Add food orders first, or proceed directly to payment for table reservation only.
              </p>
            </div>
          ) : (
            <>
          {/* Date & Time Selection */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Date & Time
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Select Time Slot *
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <div className="mb-8">
            <div className="mb-2">
              <h2 className="text-gray-800 text-xl font-semibold text-center">
                Select Tables {loading && <span className="text-sm text-gray-500">(Checking...)</span>}
              </h2>
            </div>
            <div className="text-center mb-2">
              <p className="text-red-600 font-semibold text-sm bg-red-50 inline-block px-4 py-2 rounded-full">
                💰 Rs.{TABLE_PRICE_PER_TABLE} per table reservation
              </p>
            </div>
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border"></div>
                <span className="text-sm text-gray-600">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleTableSelect(1)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(1)}
                `}
                disabled={!availableTables.includes(1) || loading}
              >
                Table 1
              </button>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelect(tableNum)}
                    className={`
                      h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                      ${getTableButtonClass(tableNum)}
                    `}
                    disabled={!availableTables.includes(tableNum) || loading}
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[5, 6, 7].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelect(tableNum)}
                    className={`
                      h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                      ${getTableButtonClass(tableNum)}
                    `}
                    disabled={!availableTables.includes(tableNum) || loading}
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleTableSelect(8)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(8)}
                `}
                disabled={!availableTables.includes(8) || loading}
              >
                Table 8
              </button>
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-4 text-center">
              Special Requests (Optional)
            </h2>
            <div>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or preferences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                rows="3"
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
            </div>
          </div>

          {/* Reservation Summary */}
          {(selectedTables.length > 0 || selectedDate || selectedTimeSlot) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Reservation Summary:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedTables.length > 0 && (
                  <p>📍 Selected Tables: {selectedTables.sort((a, b) => a - b).join(', ')}</p>
                )}
                {selectedDate && (
                  <p>📅 Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                )}
                {selectedTimeSlot && (
                  <p>⏰ Time: {selectedTimeSlot}</p>
                )}
                {specialRequests && (
                  <p>📝 Special Requests: {specialRequests}</p>
                )}
                {selectedTables.length > 0 && (
                  <p>🪑 Table Reservation: {selectedTables.length} table(s) × Rs.{TABLE_PRICE_PER_TABLE} = Rs.{getTableTotal()}</p>
                )}
                {selectedTables.length > 0 && (
                  <p className="font-bold text-red-600 text-lg mt-2">💰 Total Amount: Rs.{getTableTotal()}</p>
                )}
              </div>
            </div>
          )}

          {/* Reserve Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReserve}
              disabled={!selectedDate || !selectedTimeSlot || selectedTables.length === 0 || loading}
              className={`
                px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200
                ${(selectedDate && selectedTimeSlot && selectedTables.length > 0 && !loading)
                  ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Processing...' : 'Reserve Now'}
            </button>
          </div>
          </>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}