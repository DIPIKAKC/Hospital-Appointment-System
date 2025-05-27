const jwt = require("jsonwebtoken");
const {RegisterUser, RegisterDoctor, RegisterAdmin} = require("../Schema/registerSchema");
const { default: mongoose } = require("mongoose");

// Authentication middleware
const auth = async (req, res, next) => {
  try {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {expiresIn: '1h'});
    console.log('Decoded Token:', decoded); // Log the decoded token
    
    // Get user from database
    let user;
    if (decoded.role === "doctor") {
      user = await RegisterDoctor.findById(decoded.id);
    } else if (decoded.role === "patient") {
      user = await RegisterUser.findById(decoded.id);
    } else if (decoded.role === "admin") {
      user = await RegisterAdmin.findById(decoded.id);
    }
    

    console.log('User from DB:', user); // Log the user information
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user= user;
    
    req.userId = decoded.id; // Ensure userId is attached to the request object
    req.userRole = decoded.role; // Ensure userRole is attached to the request object
    
    
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not autorized' });
  }
};

// Middleware to restrict access based on user role
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });w
    }
    next();
  };
};

module.exports = { auth, authorize }; 