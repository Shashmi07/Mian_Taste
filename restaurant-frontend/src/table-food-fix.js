// Handle table+food reservation payment (FIXED VERSION - COPY OF TABLE-ONLY PATTERN)
else if (orderData?.type === 'table-food') {
  console.log('🔍 Processing table-food reservation:', orderData);
  const originalReservationDetails = orderData.reservationDetails;
  
  console.log('🔍 Original reservation details:', originalReservationDetails);
  
  // Get food items from orderData.items
  let foodItems = [];
  let foodTotal = 0;
  
  if (orderData.items && orderData.items.length > 0) {
    foodItems = orderData.items.map(item => ({
      name: item.name,
      quantity: item.quantity || item.count || 1,
      price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
    }));
    foodTotal = foodItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Transform data to match backend expectations (SAME PATTERN AS TABLE-ONLY)
  const reservationData = {
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    reservationDate: originalReservationDetails.date || originalReservationDetails.reservationDate,
    timeSlot: originalReservationDetails.timeSlot,
    selectedTables: originalReservationDetails.tables || originalReservationDetails.selectedTables,
    specialRequests: originalReservationDetails.specialRequests || '',
    hasFood: true, // table+food reservation
    foodItems: foodItems,
    foodTotal: foodTotal,
    tableTotal: originalReservationDetails.tableAmount || 500,
    grandTotal: (originalReservationDetails.tableAmount || 500) + foodTotal
  };
  
  console.log('🔍 Transformed reservation data for backend:', reservationData);
  
  // Create the reservation after successful payment
  const response = await createReservation(reservationData);
  
  if (response.success) {
    console.log('🔍 Table+food reservation success handler');
    const tableNumbers = reservationData.selectedTables.sort((a, b) => a - b).join(', ');
    const tableCostInfo = `\nTable Reservation: ${reservationData.selectedTables.length} table(s) × Rs.500 = Rs.${reservationData.tableTotal}`;
    const foodInfo = `\nFood Order: ${reservationData.foodItems.length} items = Rs.${reservationData.foodTotal}`;
    const totalInfo = `\nTOTAL PAID: Rs.${reservationData.grandTotal}`;
    alert(`🎉 Table + Food Reservation Confirmed & Payment Successful!${tableCostInfo}${foodInfo}${totalInfo}\n\n📋 Details:\nReservation ID: ${response.reservation.reservationId}\nTables: ${tableNumbers}\nDate: ${reservationData.reservationDate}\nTime: ${reservationData.timeSlot}\n\n💡 Please save your reservation ID for future reference.`);
    
    // Clean up ALL reservation and cart data to prevent conflicts
    localStorage.removeItem('pendingReservation');
    localStorage.removeItem('reservationContext');
    localStorage.removeItem('orderData');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('reservationState');
    localStorage.removeItem('returnAfterLogin');
    clearCart(); // Clear cart context after successful table+food reservation
    
    console.log('🧹 Cleared all reservation and cart data after successful payment');
    
    // Navigate to home
    navigate('/');
  } else {
    throw new Error(response.message || 'Failed to create reservation');
  }