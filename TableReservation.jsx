import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, UtensilsCrossed, CreditCard, Users, ArrowLeft } from 'lucide-react';
import moment from 'moment-timezone';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { checkAvailability } from '../services/tableReservationAPI';
import CustomDatePicker from '../components/CustomDatePicker';
import { useCart } from '../context/CartContext';
import { tableSelectionSchema } from '../utils/validation';

// Constants
const TABLE_PRICE_PER_TABLE = 500;

export default function TableReservation() {
  const { clearCart } = useCart();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: type selection, 2: table details
  const [reservationType, setReservationType] = useState(''); // 'table-only' or 'table-food'
  
  // Table booking states
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTables, setAvailableTables] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Customer info for validation
  // eslint-disable-next-line no-unused-vars
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const timeSlots = [
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00'
  ];

  // Get minimum allowed date (today in Sri Lankan time)
  const getMinDate = () => {
    return moment.tz('Asia/Colombo').format('YYYY-MM-DD');
  };

  // Check if date is valid (today to next 30 days in Sri Lankan time)
  const isValidDate = (date) => {
    const today = moment.tz('Asia/Colombo').startOf('day');
    const maxDate = moment.tz('Asia/Colombo').add(30, 'days').endOf('day');
    const selectedDate = moment(date).startOf('day');
    
    console.log('Date validation:', {
      today: today.format('YYYY-MM-DD'),
      maxDate: maxDate.format('YYYY-MM-DD'),
      selectedDate: selectedDate.format('YYYY-MM-DD'),
      isValid: selectedDate.isSameOrAfter(today) && selectedDate.isSameOrBefore(maxDate)
    });

    return selectedDate.isSameOrAfter(today) && selectedDate.isSameOrBefore(maxDate);
  };

  // Check if time slot is in the past
  const isTimeSlotPast = (timeSlot) => {
    if (!selectedDate) return false;

    const now = moment.tz('Asia/Colombo'); // Use Sri Lankan time
    const selectedMoment = moment(selectedDate).startOf('day');
    
    // If selected date is in the future, all slots are available
    if (selectedMoment.isAfter(now, 'day')) {
      return false;
    }

    // If selected date is today, check if time has passed
    if (selectedMoment.isSame(now, 'day')) {
      // Parse time slot (e.g., "11:00-12:00")
      const [startTime] = timeSlot.split('-');
      const slotTime = moment.tz(selectedDate + ' ' + startTime, 'YYYY-MM-DD HH:mm', 'Asia/Colombo');
      
      console.log('Today slot check:', {
        currentTime: now.format('YYYY-MM-DD HH:mm'),
        slotTime: slotTime.format('YYYY-MM-DD HH:mm'),
        isPast: slotTime.isBefore(now)
      });
      
      // Return true only if slot start time has already passed
      return slotTime.isBefore(now);
    }

    // If selected date is in the past, all slots are unavailable
    return true;
  };

  // Date and time validation is handled by our utility functions

  // Clear cart when starting fresh and restore reservation state after login
  useEffect(() => {
    // ALWAYS clear all old data when starting fresh table reservation
    localStorage.removeItem('currentOrder');
    localStorage.removeItem('orderData');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('reservationContext');
    
    if (clearCart) {
      clearCart();
    }
    
    console.log('🧹 TableReservation: Cleared old cart/order data on page load');

    // Check if user returned from login and restore reservation state
    const savedReservationState = localStorage.getItem('reservationState');
    const customerToken = localStorage.getItem('customerToken');
    const customerUser = localStorage.getItem('customerUser');
    
    console.log('Checking for saved reservation state:', !!savedReservationState);
    console.log('User logged in:', !!customerToken);
    
    // Auto-populate customer info if user is logged in
    if (customerToken && customerUser) {
      try {
        const userData = JSON.parse(customerUser);
        setCustomerInfo({
          customerName: userData.username || userData.name || '',
          customerEmail: userData.email || '',
          customerPhone: userData.phoneNumber || userData.phone || ''
        });
      } catch (error) {
        console.error('Error parsing customer data:', error);
      }
    }
    
    if (savedReservationState && customerToken) {
      try {
        const state = JSON.parse(savedReservationState);
        console.log('Restoring reservation state:', state);
        
        setReservationType(state.reservationType);
        setSelectedTables(state.selectedTables || []);
        setSelectedDate(state.selectedDate || '');
        setSelectedTimeSlot(state.selectedTimeSlot || '');
        setSpecialRequests(state.specialRequests || '');
        setCurrentStep(state.currentStep || 2);
        
        // Clear the saved state
        localStorage.removeItem('reservationState');
        localStorage.removeItem('returnAfterLogin');
        
        console.log('✅ Successfully restored reservation state after login');
      } catch (error) {
        console.error('Error restoring reservation state:', error);
        localStorage.removeItem('reservationState');
        localStorage.removeItem('returnAfterLogin');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Empty dependency array - run only once on mount to prevent infinite loop

  // Handle reservation type selection
  const handleReservationTypeSelect = (type) => {
    setReservationType(type);
    setCurrentStep(2);
  };

  // Check availability when date or time changes
  const checkTableAvailability = useCallback(async () => {
    if (!selectedDate || !selectedTimeSlot) return;
    
    try {
      setLoading(true);
      console.log('🔍 Checking availability for:', { date: selectedDate, timeSlot: selectedTimeSlot });
      const response = await checkAvailability(selectedDate, selectedTimeSlot);
      
      console.log('🔍 Availability API response:', response);
      
      if (response.success) {
        const reservedTables = response.reservedTables || [];
        const allTables = [1, 2, 3, 4, 5, 6, 7, 8];
        const available = allTables.filter(table => !reservedTables.includes(table));
        
        console.log('🔍 Reserved tables:', reservedTables);
        console.log('🔍 Available tables:', available);
        
        setAvailableTables(available);
        
        // Reset selected tables if any are no longer available
        setSelectedTables(prev => prev.filter(table => available.includes(table)));
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTimeSlot]);

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      checkTableAvailability();
    }
  }, [selectedDate, selectedTimeSlot, checkTableAvailability]);
  
  // Cleanup effect to ensure no lingering state blocks navigation
  useEffect(() => {
    return () => {
      // Cleanup on unmount - ensure loading is reset
      setLoading(false);
      console.log('TableReservation: Component unmounting, cleanup complete');
    };
  }, []);

  const handleTableSelect = (tableId) => {
    if (!availableTables.includes(tableId)) return;
    
    setSelectedTables(prev => {
      const newSelection = prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId];
      
      // Update Formik field value if form is available
      const form = document.querySelector('form');
      if (form) {
        // Trigger a form update event
        window.dispatchEvent(new CustomEvent('tableSelectionChange', { 
          detail: { selectedTables: newSelection } 
        }));
      }
      
      return newSelection;
    });
  };

  const getTableTotal = () => {
    return selectedTables.length * TABLE_PRICE_PER_TABLE;
  };

  const handleProceed = async () => {
    // Prevent multiple clicks
    if (loading) {
      console.log('Already processing, please wait...');
      return;
    }

    console.log('🔍 PROCEED CLICKED - Current selection:', {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      tables: selectedTables,
      type: reservationType
    });
    
    // Check if user is logged in
    const customerToken = localStorage.getItem('customerToken');
    const customerUser = localStorage.getItem('customerUser');
    
    if (!customerToken || !customerUser) {
      // Store current reservation state before redirecting to login
      const reservationState = {
        reservationType,
        selectedTables,
        selectedDate,
        selectedTimeSlot,
        specialRequests,
        currentStep: 2 // They were on step 2 (table selection)
      };
      
      localStorage.setItem('reservationState', JSON.stringify(reservationState));
      localStorage.setItem('returnAfterLogin', '/table-reservation');
      
      const shouldLogin = window.confirm(
        '🔐 Login Required\n\nPlease login to your account to make a table reservation.\n\nWould you like to go to the login page now?'
      );
      
      if (shouldLogin) {
        console.log('Navigating to login page...');
        // Use window.location for more reliable navigation
        window.location.href = '/login';
      }
      return;
    }

    // Set loading state for UI feedback
    setLoading(true);

    try {
      const userData = JSON.parse(customerUser);

      if (reservationType === 'table-only') {
        // For table-only reservations, go directly to payment
        const reservationData = {
          type: 'table-only',
          customerName: userData.username || userData.name || '',
          customerEmail: userData.email || '',
          customerPhone: userData.phoneNumber || userData.phone || '',
          selectedTables: selectedTables,
          selectedDate: selectedDate,
          selectedTimeSlot: selectedTimeSlot,
          specialRequests: specialRequests,
          tableTotal: getTableTotal(),
          total: getTableTotal()
        };
        
        console.log('✅ Table-only reservation - Preparing data');
        console.log('Customer:', {
          name: userData.username || userData.name,
          email: userData.email,
          phone: userData.phoneNumber || userData.phone
        });

        // Store reservation data for payment (PaymentGateway expects this format)
        const pendingReservation = {
          type: 'reservation',
          data: {
            ...reservationData,
            tableCost: {
              pricePerTable: TABLE_PRICE_PER_TABLE,
              totalTableCost: getTableTotal()
            },
            preOrder: {
              items: [],
              totalAmount: 0
            }
          },
          total: getTableTotal(),
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('pendingReservation', JSON.stringify(pendingReservation));
        console.log('✅ Stored pendingReservation:', pendingReservation);

        // Navigate to payment immediately
        console.log('🚀 Navigating to payment gateway...');
        window.location.href = '/payment';
        
      } else if (reservationType === 'table-food') {
        console.log('✅ Table+Food reservation - Preparing data');
        console.log('Customer:', {
          name: userData.username || userData.name,
          email: userData.email,
          phone: userData.phoneNumber || userData.phone
        });

        // Store reservation data for table+food flow
        const tableReservationData = {
          type: 'table-food',
          data: {
            customerName: userData.username || userData.name || '',
            customerEmail: userData.email || '',
            customerPhone: userData.phoneNumber || userData.phone || '',
            reservationDate: selectedDate,
            timeSlot: selectedTimeSlot,
            selectedTables: selectedTables,
            specialRequests: specialRequests,
            tableCost: {
              pricePerTable: TABLE_PRICE_PER_TABLE,
              totalTableCost: getTableTotal()
            },
            preOrder: {
              items: [],
              totalAmount: 0
            }
          },
          total: getTableTotal(),
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('pendingReservation', JSON.stringify(tableReservationData));
        console.log('✅ Stored pendingReservation:', tableReservationData);
        
        // ALSO create reservationContext for Menu/Cart compatibility
        const reservationContext = {
          customerName: userData.username || userData.name || '',
          tableDetails: {
            tables: selectedTables,
            date: selectedDate,
            timeSlot: selectedTimeSlot
          },
          tableAmount: getTableTotal(),
          reservationId: 'TEMP-' + Date.now() // Temporary ID for display
        };
        
        localStorage.setItem('reservationContext', JSON.stringify(reservationContext));
        console.log('✅ Stored reservationContext:', reservationContext);
        
        // Navigate to menu for food selection
        console.log('🚀 Navigating to menu page...');
        window.location.href = '/menu';
      }
    } catch (error) {
      console.error('❌ Error processing reservation:', error);
      alert('Error processing reservation: ' + error.message + '\n\nPlease try again.');
      setLoading(false); // ✅ Reset loading state on error
    }
  };

  const getTableButtonClass = (tableNum) => {
    const isSelected = selectedTables.includes(tableNum);
    const isAvailable = availableTables.includes(tableNum);
    
    if (isSelected) {
      return 'bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105';
    } else if (isAvailable) {
      return 'bg-green-500 border-green-600 text-white hover:bg-green-600 hover:shadow-md hover:transform hover:scale-105 active:bg-green-700';
    } else {
      return 'bg-red-400 border-red-500 text-white cursor-not-allowed opacity-75';
    }
  };

  // Step 1: Reservation Type Selection
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <NavBar />
        
        <main className="pt-8">
          <div className="relative h-20 flex items-center justify-center pt-2">
            <h1 className="text-gray-800 text-3xl font-bold tracking-wide drop-shadow-lg">
              Choose Your Reservation Type
            </h1>
          </div>
          
          <div className="px-3 md:px-6 py-4 md:py-8">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto">
              
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg">
                  How would you like to make your reservation?
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Table Only Option */}
                <div 
                  onClick={() => handleReservationTypeSelect('table-only')}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Table Only</h3>
                    <p className="text-gray-600 mb-4">
                      Reserve tables for dining. You can order food at the restaurant.
                    </p>
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Rs.500 per table
                    </div>
                   
                  </div>
                </div>

                {/* Table + Food Option */}
                <div 
                  onClick={() => handleReservationTypeSelect('table-food')}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UtensilsCrossed className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Table + Food</h3>
                    <p className="text-gray-600 mb-4">
                      Reserve tables and pre-order your food. Everything will be ready when you arrive.
                    </p>
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Rs.500 per table + food cost
                    </div>
                   
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  💡 All table reservations require card payment for confirmation
                </p>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step 2: Table Selection and Details
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <NavBar />
      
      <main className="pt-8">
        <div className="relative h-20 flex items-center justify-center pt-6">
          <button 
            onClick={() => setCurrentStep(1)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-gray-800 text-3xl font-bold tracking-wide drop-shadow-lg">
            {reservationType === 'table-only' ? 'Table Reservation' : 'Table + Food Reservation'}
          </h1>
        </div>
        
        <div className="px-3 md:px-6 py-4 md:py-8">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto">

            {/* Reservation Type Badge */}
            <div className="flex justify-center mb-6">
              <div className={`px-6 py-2 rounded-full text-white font-semibold ${
                reservationType === 'table-only' ? 'bg-blue-500' : 'bg-orange-500'
              }`}>
                {reservationType === 'table-only' ? (
                  <><Users className="w-4 h-4 inline mr-2" /> Table Only Reservation</>
                ) : (
                  <><UtensilsCrossed className="w-4 h-4 inline mr-2" /> Table + Food Reservation</>
                )}
              </div>
            </div>

            <Formik
              initialValues={{
                reservationDate: selectedDate,
                timeSlot: selectedTimeSlot,
                selectedTables: selectedTables
              }}
              validationSchema={tableSelectionSchema}
              enableReinitialize={true}
              onSubmit={handleProceed}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form>

                  {/* Date & Time Selection */}
                  <div className="mb-8">
                    <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
                      Select Date & Time
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline w-4 h-4 mr-2" />
                          Date *
                        </label>
                        <CustomDatePicker
                          selectedDate={values.reservationDate}
                          onChange={(date) => {
                            if (!isValidDate(date)) {
                              alert('Please select today or a future date');
                              setFieldValue('reservationDate', '');
                              setSelectedDate('');
                              return;
                            }
                            
                            console.log('Date selected:', date);
                            setFieldValue('reservationDate', date);
                            setSelectedDate(date);
                            // Clear selected time slot when date changes
                            setFieldValue('timeSlot', '');
                            setSelectedTimeSlot('');
                          }}
                          minDate={getMinDate()}
                        />
                        <ErrorMessage name="reservationDate" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="inline w-4 h-4 mr-2" />
                          Time Slot *
                        </label>
                        <Field
                          name="timeSlot"
                          as="select"
                          value={values.timeSlot}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                            errors.timeSlot && touched.timeSlot ? 'border-red-500' : 'border-gray-300'
                          }`}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue('timeSlot', value);
                            setSelectedTimeSlot(value);
                            console.log('Time slot selected:', value);
                          }}
                        >
                          <option value="">Choose time slot</option>
                          {timeSlots.map((time) => {
                            const isPast = isTimeSlotPast(time);
                            return (
                              <option 
                                key={time} 
                                value={time} 
                                disabled={isPast}
                                style={{
                                  color: isPast ? '#ff0000' : 'inherit',
                                  backgroundColor: isPast ? '#ffebeb' : 'inherit'
                                }}
                              >
                                {time}
                              </option>
                            );
                          })}
                        </Field>
                        <ErrorMessage name="timeSlot" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                  </div>

            {/* Table Selection - Original Design */}
            {selectedDate && selectedTimeSlot && (
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

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <p className="mt-2 text-gray-600">Checking availability...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <button
                        type="button"
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
                            type="button"
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
                            type="button"
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
                        type="button"
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

                    {selectedTables.length > 0 && (
                      <div className="text-center bg-gray-50 rounded-lg p-4 mt-6">
                        <p className="text-gray-700 mb-2">
                          Selected Tables: <span className="font-semibold">{selectedTables.sort((a, b) => a - b).join(', ')}</span>
                        </p>
                        <p className="font-bold text-red-600 text-lg">💰 Table Cost: Rs.{getTableTotal()}</p>
                      </div>
                    )}
                    
                    {/* Table selection validation error */}
                    {errors.selectedTables && touched.selectedTables && (
                      <div className="text-red-500 text-sm text-center mt-4">
                        {errors.selectedTables}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Special Requests */}
            {selectedTables.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  placeholder="Any special requirements or requests..."
                />
              </div>
            )}


                  {/* Proceed Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={!selectedDate || !selectedTimeSlot || selectedTables.length === 0 || loading}
                      className={`
                        px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center gap-2
                        ${(selectedDate && selectedTimeSlot && selectedTables.length > 0 && !loading)
                          ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : reservationType === 'table-only' ? (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Proceed to Payment
                        </>
                      ) : (
                        <>
                          <UtensilsCrossed className="w-5 h-5" />
                          Choose Food Items
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}