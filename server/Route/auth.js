const express = require("express");
const router = express.Router();
const { auth, authorize } = require('../Middleware/authentication');

const { registerUser, loginUser, getUserById, 
    editUserData, deleteUserData, bookAppointment, 
    cancelAppointment, getAvailableSlots, getAllDoctors, getDepartments,
    getDoctorById, getMyAppointments,
    setReminders,
    changePassword,
    verifyEmail,
    forgotPassword,
    pwChange,
    checkpayment} = require("../Control/userControl");
const { doctorSlotsPost, 
    appointmentStatus, getMeDoctor, getAppointments,
    getAppointmentStats,
    getMyPatients,
    editDoctorData,
    changePwDoc,
    verifyDoctorEmail} = require("../Control/doctorControl")
const {registerAdmin, loginAdmin, addDepartments, getMeDAdmin, registerDoctor, 
    getAllAppointments,
    getAllUsers,
    getAdminDoctors,
    getAdminDepartments,
    adminDeleteAppointment,
    adminDeleteDoctors,
    adminUpdateDoctor,
    adminUpdateDepartment,
    adminDeleteDepartment,
    adminDeleteUsers,
    getStats,
    updateResource,
    getResources,
    addResource,
    adminDeleteResources,
    verifyAdminEmail} = require("../Control/adminControl");
const { createNotification, getNotification, markNotificationAsRead, markAllNotificationsAsRead } = require("../Control/notificationControl");
const { khaltiPaymentInitiation, verifyKhaltiPayment } = require("../Control/paymentControl");
const { verifyEmailMail } = require("../Control/sendEmail");
//const verifyKhaltiPayment = require("../Control/verifyKhaltiPayment");

const {upload} = require("../utils/Multer")




//USER

// Route for user and registration
router.post("/signup", registerUser);
//user and doctor login
router.post("/login", loginUser);
//get user by id
router.get("/me-user", auth, getUserById)
//update user data
router.patch("/edit-user-by-id/:userId",upload.single("image") ,editUserData)
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
//email verification
router.patch("/verify-email/:token",verifyEmail)
//forgot password
router.post("/forgot-password", forgotPassword)
//reset pw
router.patch("/password-reset/:token/:role", pwChange)
//check for pay
router.get("/check-pay", checkpayment)



//DOCTOR

//Route for doc registration
// router.post("/login-doc", loginDoctor);
//adding time slot for appointments
router.post("/add-time-slot", auth, authorize("doctor"),  doctorSlotsPost)
//getting doctor's assigned appointment
router.get("/my-assigned-appointments", auth, authorize("doctor"), getAppointments)
//updating user appointment status - reject/confirm
router.patch("/:id/status", auth, authorize('doctor'), appointmentStatus)
//get profile
router.get("/me", auth, getMeDoctor)
//edit profile
router.patch('/edit-doc/:id', upload.single("image"), editDoctorData)
//get appointments stats
router.get("/stats-appointments", auth, authorize("doctor"), getAppointmentStats)
//get my pattients
router.get("/my-patients", getMyPatients)
//change password
router.patch("/change-pw-doc", auth, changePwDoc)
//email verification
router.patch('/verify-email/:token', verifyDoctorEmail)




//ADMIN

//route for admin registration
router.post("/register-admin", registerAdmin)
//email verification
router.patch('/verify-email/:token', verifyAdminEmail)
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

//rosource
router.post("/add-resource", auth, authorize("admin"),addResource)
router.patch("/admin/resources/edit/:id",auth, authorize("admin"), updateResource)
//for both user and admin
router.get("/resources", getResources)
router.delete("/admin/resources/delete/:id", auth , authorize("admin"), adminDeleteResources)


//NOtification
router.post('/create', createNotification)
router.get("/my-notification/:userType/:id", getNotification)
router.patch('/notification/:id/read', markNotificationAsRead)
router.patch("/notification/read-all/:userId/:userType", markAllNotificationsAsRead)

//payment
router.post('/payment/khalti/initiate', khaltiPaymentInitiation)
router.post("/payment/khalti/verify", verifyKhaltiPayment);


module.exports = router;
