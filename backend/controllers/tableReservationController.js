const { getCustomerConnection } = require('../config/customerDatabase');
const { schema: tableReservationSchema } = require('../models/TableReservation');

// Get TableReservation model using customer database connection
const getTableReservationModel = () => {
  const customerConnection = getCustomerConnection();
  return customerConnection.model('TableReservation', tableReservationSchema);
};

// Create a new table reservation
const createReservation = async (req, res) => {
  console.log('=== CREATE RESERVATION REQUEST ===');
  console.log('Request body:', req.body);
  
  try {
    const TableReservation = getTableReservationModel();
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      reservationDate,
      timeSlot,
      selectedTables,
      numberOfGuests,
      specialRequests
    } = req.body;

    console.log('Extracted data:', {
      customerName,
      customerEmail,
      customerPhone,
      reservationDate,
      timeSlot,
      selectedTables,
      numberOfGuests,
      specialRequests
    });

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !reservationDate || !timeSlot || !selectedTables || selectedTables.length === 0) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    console.log('Validation passed, checking for existing reservations...');

    // Check if tables are already reserved for the same date and time slot
    const existingReservation = await TableReservation.findOne({
      reservationDate: new Date(reservationDate),
      timeSlot,
      selectedTables: { $in: selectedTables },
      status: { $in: ['pending', 'confirmed'] }
    });

    console.log('Existing reservation check result:', existingReservation);

    if (existingReservation) {
      const conflictingTables = selectedTables.filter(table => 
        existingReservation.selectedTables.includes(table)
      );
      console.log('Conflicting tables found:', conflictingTables);
      return res.status(409).json({
        success: false,
        message: `Tables ${conflictingTables.join(', ')} are already reserved for ${timeSlot} on ${reservationDate}`
      });
    }

    console.log('No conflicts found, creating new reservation...');

    // Create new reservation
    const reservation = new TableReservation({
      customerName,
      customerEmail,
      customerPhone,
      reservationDate: new Date(reservationDate),
      timeSlot,
      selectedTables,
      numberOfGuests: numberOfGuests || selectedTables.length * 4,
      specialRequests: specialRequests || ''
    });

    console.log('Reservation object created:', reservation);

    await reservation.save();
    console.log('Reservation saved successfully to customer database');

    res.status(201).json({
      success: true,
      message: 'Table reservation created successfully',
      reservation: {
        reservationId: reservation.reservationId,
        customerName: reservation.customerName,
        reservationDate: reservation.reservationDate,
        timeSlot: reservation.timeSlot,
        selectedTables: reservation.selectedTables,
        status: reservation.status
      }
    });

  } catch (error) {
    console.error('=== ERROR IN CREATE RESERVATION ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Check table availability
const checkAvailability = async (req, res) => {
  console.log('=== CHECK AVAILABILITY REQUEST ===');
  console.log('Query params:', req.query);
  
  try {
    const TableReservation = getTableReservationModel();
    
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Date and time slot are required'
      });
    }

    console.log('Checking availability for:', { date, timeSlot });

    // Find all reserved tables for the given date and time slot
    const reservations = await TableReservation.find({
      reservationDate: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    }).select('selectedTables');

    console.log('Found reservations:', reservations);

    // Get all reserved table numbers
    const reservedTables = reservations.reduce((acc, reservation) => {
      return acc.concat(reservation.selectedTables);
    }, []);

    // All available tables (1-8 based on your frontend)
    const allTables = [1, 2, 3, 4, 5, 6, 7, 8];
    const availableTables = allTables.filter(table => !reservedTables.includes(table));

    console.log('Available tables:', availableTables);
    console.log('Reserved tables:', reservedTables);

    res.json({
      success: true,
      availableTables,
      reservedTables: [...new Set(reservedTables)]
    });

  } catch (error) {
    console.error('=== ERROR IN CHECK AVAILABILITY ===');
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
};

// Get reservation by ID
const getReservationById = async (req, res) => {
  try {
    const TableReservation = getTableReservationModel();
    const { reservationId } = req.params;

    const reservation = await TableReservation.findOne({
      reservationId: reservationId
    }).select('-__v');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      reservation
    });

  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservation',
      error: error.message
    });
  }
};

// Get all reservations (for admin/staff)
const getAllReservations = async (req, res) => {
  try {
    const TableReservation = getTableReservationModel();
    const { date, status } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.reservationDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    if (status) {
      query.status = status;
    }

    const reservations = await TableReservation.find(query)
      .sort({ reservationDate: 1, timeSlot: 1 })
      .select('-__v');

    res.json({
      success: true,
      reservations
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
      error: error.message
    });
  }
};

// Update reservation status
const updateReservationStatus = async (req, res) => {
  try {
    const TableReservation = getTableReservationModel();
    const { reservationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const reservation = await TableReservation.findOneAndUpdate(
      { reservationId },
      { status },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      message: 'Reservation status updated successfully',
      reservation
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
      error: error.message
    });
  }
};

// Cancel reservation
const cancelReservation = async (req, res) => {
  try {
    const TableReservation = getTableReservationModel();
    const { reservationId } = req.params;

    const reservation = await TableReservation.findOneAndUpdate(
      { reservationId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      reservation
    });

  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation',
      error: error.message
    });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  checkAvailability,
  updateReservationStatus,
  cancelReservation
};