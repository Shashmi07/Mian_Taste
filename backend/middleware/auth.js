const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId);
    console.log('User found:', !!user);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    console.log('✅ Auth successful for user:', user.name);
    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Fix: Export as default function, not as object
module.exports = auth;