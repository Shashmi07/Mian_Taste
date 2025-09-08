const express = require('express');
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getReservationById,
  checkAvailability,
  updateReservationStatus,
  cancelReservation
} = require('../controllers/tableReservationController');
const auth = require('../middleware/auth');

// IMPORTANT: Put specific routes BEFORE parameterized routes
// Public routes - Specific routes first
router.get('/availability', checkAvailability);         // GET /api/table-reservations/availability
router.post('/', createReservation);                    // POST /api/table-reservations

// Admin routes (for now, removing auth to test - add back later)
router.get('/', getAllReservations);                    // GET /api/table-reservations (get all reservations for admin)

// Protected routes (require authentication)
// router.get('/admin/all', auth, getAllReservations);                    // GET /api/table-reservations/admin/all

// Parameterized routes LAST (these catch everything that doesn't match above)
router.get('/:reservationId', getReservationById);                     // GET /api/table-reservations/RES123456
router.put('/:reservationId/status', updateReservationStatus);   // PUT /api/table-reservations/RES123456/status (temporarily remove auth for testing)
router.put('/:reservationId/cancel', cancelReservation);         // PUT /api/table-reservations/RES123456/cancel (temporarily remove auth for testing)

module.exports = router;