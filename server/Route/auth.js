const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUserById, editUserData, deleteUserData, bookAppointment} = require("../Control/userControl");
const {registerDoctor, loginDoctor, getDoctorById} = require("../Control/doctorControl")
const {registerAdmin, loginAdmin} = require("../Control/adminControl")




//USER

// Route for user and registration
router.post("/signup", registerUser);
//user and doctor login
router.post("/login", loginUser);
//get user by id
router.get("/get-user-by-id/:userId", getUserById)
//update user data
router.put("/edit-user-by-id/:userId", editUserData)
//delete user
router.delete("/delete-user-by-id/:userId", deleteUserData)




//DOCTOR

//Route for doc registration
router.post("/add-doctor", registerDoctor)
router.post("/login-doc", loginDoctor);
// router.get("/get-doc-by-id/:doctorId", getDoctorById)




//ADMIN

//route for admin registration
router.post("/register-admin", registerAdmin)
router.post("/login-admin", loginAdmin)

module.exports = router;
