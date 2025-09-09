const express = require('express');
const { body } = require('express-validator');
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile
} = require('../controllers/customerController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('username')
    .isLength({ min: 2 })
    .withMessage('Username must be at least 2 characters long')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Customer registration route
router.post('/register', registerValidation, registerCustomer);

// Customer login route
router.post('/login', loginValidation, loginCustomer);

// Get customer profile (protected route)
router.get('/profile', auth, getCustomerProfile);

// Update customer profile (protected route)
router.put('/profile', auth, updateCustomerProfile);

module.exports = router;
