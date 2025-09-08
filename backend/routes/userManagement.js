const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUsersByRole,
  createAdminUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
} = require('../controllers/userManagementController');

// Middleware for authentication (you may need to adjust this based on your auth middleware)
// const auth = require('../middleware/auth');

// Routes

// GET /api/user-management/users - Get all users
router.get('/users', getAllUsers);

// GET /api/user-management/users/role/:role - Get users by role (admin, chef, waiter, customer)
router.get('/users/role/:role', getUsersByRole);

// GET /api/user-management/stats - Get user statistics
router.get('/stats', getUserStats);

// POST /api/user-management/users - Create new admin user (admin, chef, waiter)
router.post('/users', createAdminUser);

// PUT /api/user-management/users/:id - Update user
// Query parameter: userType (staff or customer)
router.put('/users/:id', updateUser);

// DELETE /api/user-management/users/:id - Soft delete user (set isActive to false)
// Query parameter: userType (staff or customer)
router.delete('/users/:id', deleteUser);

// PATCH /api/user-management/users/:id/toggle-status - Toggle user active status
// Query parameter: userType (staff or customer)
router.patch('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
