const jwt = require("jsonwebtoken");
const {RegisterUser} = require("../Schema/registerSchema");
const { default: mongoose } = require("mongoose");

// Authentication middleware
const auth = async (req, res, next) => {
  try {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token
    
    // Get user from database
    const user = await RegisterUser.findById(decoded.id)
    
    console.log('User from DB:', user); // Log the user information
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Middleware to restrict access based on user role
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

module.exports = { auth, authorize }; 