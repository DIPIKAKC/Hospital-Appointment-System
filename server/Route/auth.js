const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../Middleware/authentication');

const { registerUser, loginUser, getUserById, 
    editUserData, deleteUserData, bookAppointment, 
    cancelAppointment} = require("../Control/userControl");
const {registerDoctor, loginDoctor, doctorSlotsPost, appointmentStatus} = require("../Control/doctorControl")
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
//book an appointment
router.post("/book-appointment", auth, authorize("patient"), bookAppointment )
//Cancel appointment
router.patch("/:id/cancel", auth, cancelAppointment )
 



//DOCTOR

//Route for doc registration
router.post("/add-doctor", registerDoctor)
router.post("/login-doc", loginDoctor);
//adding time slot for appointments
router.post("/add-time-slot", auth, authorize("doctor"),  doctorSlotsPost)
// router.get("/my-assigned-appointments", auth, authorize("doctor"), getAppointments)
//updating user appointment status - reject/confirm
router.put("/:id/status", auth, authorize("doctor"),  appointmentStatus)



//ADMIN

//route for admin registration
router.post("/register-admin", registerAdmin)
router.post("/login-admin", loginAdmin)

module.exports = router;
