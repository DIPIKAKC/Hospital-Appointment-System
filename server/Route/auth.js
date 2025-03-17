const express = require("express");
const router = express.Router();
const { registerUser, loginUser} = require("../Control/userControl");

//USER

// Route for user registration
router.post("/signup", registerUser);
//user login
router.post("/login", loginUser);


module.exports = router;
