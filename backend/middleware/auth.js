const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// For backward compatibility, also export as protect
const protect = auth;

module.exports = auth;
module.exports.protect = protect;