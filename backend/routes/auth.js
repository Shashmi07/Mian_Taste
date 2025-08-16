const express = require('express');
const { body } = require('express-validator');
const { login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);

module.exports = router;