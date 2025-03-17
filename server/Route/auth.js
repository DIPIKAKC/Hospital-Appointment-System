const express = require("express");
const router = express.Router();
const { registerUser} = require("../Control/userControl");

//USER

// Route for user registration
router.post("/signup", registerUser);

module.exports = router;
