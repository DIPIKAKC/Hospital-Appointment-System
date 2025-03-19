const express = require("express");
const router = express.Router();
const { registerUser, loginUser} = require("../Control/userControl");
const {registerDoctor, loginDoctor} = require("../Control/doctorControl")
const {registerAdmin, loginAdmin} = require("../Control/adminControl")




//USER

// Route for user and registration
router.post("/signup", registerUser);
//user and doctor login
router.post("/login", loginUser);





//DOCTOR

//Route for doc registration
router.post("/add-doctor", registerDoctor)
router.post("/login-doc", loginDoctor);




//ADMIN

//route for admin registration
router.post("/register-admin", registerAdmin)
router.post("/login-admin", loginAdmin)

module.exports = router;
