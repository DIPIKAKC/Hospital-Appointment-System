const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../Middleware/authentication');

const { registerUser, loginUser, getUserById, 
    editUserData, deleteUserData, bookAppointment, 
    cancelAppointment, getAvailableSlots, getAllDoctors, getDepartments,
    getDoctorById, getMyAppointments,
    setReminders,
    changePassword} = require("../Control/userControl");
const { doctorSlotsPost, 
    appointmentStatus, getMeDoctor, getAppointments} = require("../Control/doctorControl")
const {registerAdmin, loginAdmin, addDepartments, getMeDAdmin, registerDoctor, 
    getAllAppointments,
    getAllUsers,
    getAdminDoctors,
    getAdminDepartments,
    deleteAppointment,
    adminDeleteAppointment,
    adminDeleteDoctors,
    adminUpdateDoctor,
    adminUpdateDepartment,
    adminDeleteDepartment,
    adminDeleteUsers,
    getStats} = require("../Control/adminControl");
const { createNotification, getNotification } = require("../Control/notificationControl");




//USER

// Route for user and registration
router.post("/signup", registerUser);
//user and doctor login
router.post("/login", loginUser);
//get user by id
router.get("/me-user", auth, getUserById)
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
//get doctor by id / individual
router.get("/doctor/:doctorId",getDoctorById)
//set Reminders
router.post("/reminder", auth, setReminders)
//change password
router.patch("/change-password", auth, changePassword)




//DOCTOR

//Route for doc registration
// router.post("/login-doc", loginDoctor);
//adding time slot for appointments
router.post("/add-time-slot", auth, authorize("doctor"),  doctorSlotsPost)
//getting doctor's assigned appointment
router.get("/my-assigned-appointments", auth, authorize("doctor"), getAppointments)
//updating user appointment status - reject/confirm
router.patch("/:id/status", auth, authorize("doctor"),  appointmentStatus)
//get profile
router.get("/me", auth, getMeDoctor)


//ADMIN

//route for admin registration
router.post("/register-admin", registerAdmin)
router.post("/login-admin", loginAdmin)
router.get("/me-admin", auth, getMeDAdmin)

router.post("/add-department", auth, authorize("admin"), addDepartments )
router.get("/admin/departments", auth, authorize("admin"), getAdminDepartments )
router.patch("/admin/departments/edit/:id", auth, authorize("admin"), adminUpdateDepartment )
router.delete("/admin/departments/delete/:id", auth, authorize("admin"), adminDeleteDepartment )

router.post("/add-doctor", auth, authorize("admin"), registerDoctor)
router.get("/admin/doctors", auth, authorize("admin"), getAdminDoctors )
router.get("/doctor/:id", getDoctorById);
router.patch("/admin/doctors/edit/:id", auth, authorize("admin"), adminUpdateDoctor )
router.delete("/admin/doctors/delete/:id", auth, authorize("admin"), adminDeleteDoctors )

router.get("/admin/appointments", auth, authorize("admin"), getAllAppointments)
router.delete("/admin/appointments/delete/:id", auth, authorize("admin"), adminDeleteAppointment)

router.get("/admin/users", auth, authorize("admin"), getAllUsers)
router.delete("/admin/users/delete/:id", auth, authorize("admin"), adminDeleteUsers )

router.get("/admin/stats", auth, authorize("admin"), getStats)


//NOtification
router.post('/create', createNotification)
router.get("/my-notification/:userType/:id", getNotification)

module.exports = router;
