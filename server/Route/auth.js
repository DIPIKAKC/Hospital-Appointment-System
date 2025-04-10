const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../Middleware/authentication');

const { registerUser, loginUser, getUserById, 
    editUserData, deleteUserData, bookAppointment, 
    cancelAppointment, getAvailableSlots, getAllDoctors, getDepartments,
    getDoctorById, getMyAppointments} = require("../Control/userControl");
const {registerDoctor, loginDoctor, doctorSlotsPost, 
    appointmentStatus, getMeDoctor, getAppointments} = require("../Control/doctorControl")
const {registerAdmin, loginAdmin, addDepartments} = require("../Control/adminControl");
const { createNotification, getNotification } = require("../Control/notificationControl");




//USER

// Route for user and registration
router.post("/signup", registerUser);
//user and doctor login
router.post("/login", loginUser);
//get user by id
router.get("/get-user-by-id/:userId", auth, getUserById)
//update user data
router.put("/edit-user-by-id/:userId", editUserData)
//delete user
router.delete("/delete-user-by-id/:userId", deleteUserData)
//book an appointment
router.post("/book-appointment", auth, authorize("patient"), bookAppointment )
//getMy appointments
router.get("/appointments", auth, getMyAppointments)
//Cancel appointment
router.patch("/:id/cancel", auth, cancelAppointment )
//get available doctors and their slots
router.get("/:doctorId/available-slots",  getAvailableSlots) //auth
//get all doctors
router.get("/all-doctors", getAllDoctors)
//get departments
router.get("/departments", getDepartments)
//get doctor by id
router.get("/doctor/:doctorId",getDoctorById)




//DOCTOR

//Route for doc registration
router.post("/add-doctor", registerDoctor)
router.post("/login-doc", loginDoctor);
//adding time slot for appointments
router.post("/add-time-slot", auth, authorize("doctor"),  doctorSlotsPost)
//getting doctor's assigned appointment
router.get("/my-assigned-appointments", auth, authorize("doctor"), getAppointments)
//updating user appointment status - reject/confirm
router.put("/:id/status", auth, authorize("doctor"),  appointmentStatus)
//get profile
router.get("/me", auth, getMeDoctor)


//ADMIN

//route for admin registration
router.post("/register-admin", registerAdmin)
router.post("/login-admin", loginAdmin)
router.post("/add-department", auth, authorize("admin"), addDepartments )


//NOtification
router.post('/create', createNotification)
router.get("/my-notification/:userType/:id", getNotification)

module.exports = router;
