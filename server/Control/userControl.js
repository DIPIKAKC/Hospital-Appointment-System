const {RegisterUser, RegisterDoctor} = require("../Schema/registerSchema") //imported schema
const {Appointment} =require("../Schema/appointmentSchema")
const {Department} = require("../Schema/departmentSchema")
const {Notification} = require("../Schema/notificationSchema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Reminder } = require("../Schema/reminderSchema")
const { verifyEmailMail, passwordResetMail } = require("./sendEmail")
const { AppointmentPayment } = require("../Schema/paymentSchema")
const { uploadOnCloudinary } = require("../utils/Cloudinary")


//Register function for user
const registerUser = async(req,res)=>{
    try{
        const {fullName,email,password} = req.body

        // Check if email already exists
        const existingUser = await RegisterUser.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists" });
        }

        if (!password || password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        console.log(req.body)
        const salt = await bcrypt.genSalt(10) //generating salt
        const hashedPassword = await bcrypt.hash(password,salt) 

        const user = await RegisterUser.create({
            fullName,
            email: email, 
            password: hashedPassword,
            // phone:phone,
            // dob:dob,
            // address: address
            role: "patient"
        })

        const verifyToken = await jwt.sign(
          { id: user._id},
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        verifyEmailMail(
          user.email,
          verifyToken
        )

        await user.save();

        if(user){
            res.status(200).json({message:'Successfully registered'})
        }else{
            res.status(400).json({message:"Not registered"})
        }
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    let account = await RegisterUser.findById(decoded.id);
    let role = 'patient';

    if (!account) {
      account = await RegisterDoctor.findById(decoded.id);
      role = 'doctor';
    }

    if (!account) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (role === 'patient' && account === !verified) {
      return res.status(400).json({ success: false, message: "User not verified" });
    }else if(role === 'patient' && account === !verified) {
      return res.status(400).json({ success: false, message: "Doctor not verified" });
    }
    account.verified = true;
    await account.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


//login function for User
const loginUser = async (req, res) => {

      //Extract email and password from request
      const { email, password } = req.body;
  
      try {
        // To find user in the database
        let account = await RegisterUser.findOne({ email });
        let role = 'patient';
    
        if (!account) {
          account = await RegisterDoctor.findOne({ email });
          role = 'doctor';
        }
    
        if (!account) {
          return res.status(404).json({ message: 'Email not found' });
        }

        if(role ==='patient' && !account.verified){
          return res.status(404).json({success:false, message: 'Email not verified' });
        } else if(role ==='doctor' && !account.verified){
          return res.status(404).json({success:false, message: 'Email not verified' });
        }

          // Check password
          const isMatch = await bcrypt.compare(password, account.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
          }

          // Create token
          const token = jwt.sign({ id: account._id, role }, process.env.JWT_SECRET);

          // Send response
          return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
              userId: account._id,
              fullName: account.fullName,
              email: account.email,
              role: role
            }
          });

          } catch (err) {
          return res.status(500).json({ message: err.message });
          }
          };



//Get user info by id
const getUserById = async (req,res) => {

  try {
    const user = await RegisterUser.findById(req.userId);

    if (!user) {
        return res.status(404).send({ message: "User does not exist", success: false });
    }

    user.password = undefined; // Hide password before sending response

    res.status(200).send({ success: true, data: user,
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      contact: user.contact,
      gender: user.gender,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      role: req.userRole,
     });
    
  } catch (error) {
      return res.status(500).send({ message: "Error getting user info", success: false, error });
  }
}


//Update user data by id
const editUserData = async(req,res)=>{
    try {
        const userId = req.params.userId
        // console.log(userId)
        const {fullName, contact, address, dateOfBirth, gender} = req.body

        const image =  req.file ? req.file.path : null;

        console.log("img",image)

        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (contact) updateFields.contact = contact;
        if (address) updateFields.address = address;
        if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
        if (gender) updateFields.gender = gender;


        const uploadImage =await uploadOnCloudinary("user", image)

        console.log(uploadImage)

        if(image && uploadImage){
          updateFields.profile = uploadImage.secure_url
        }


        const editUser = await RegisterUser.findByIdAndUpdate(
          userId,
          updateFields,

        
          { new: true, runValidators: true } // Return updated document and apply validators
        );

        if(!editUser){
            return res.status(404).json({success:false,message:"Unable to edit the profile"})
        }else{
            return res.status(200).json({success:true,message:"Edited successfully"})
        }
    } catch (error) {
      console.log(error)
        return res.status(400).json({success:false,message:"error",error})
    }
}



//delete user by id
const deleteUserData = async(req,res)=>{
    try {
        const userId = req.params.userId
        const { password } = req.body; // Get entered password from request body

        const deleteUser = await RegisterUser.findByIdAndDelete(userId);
        if (!deleteUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    
        // Check if password is provided
        if (!password) {
          return res.status(400).json({ success: false, message: "Password is required for account deletion" });
        }
    
        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, deleteUser.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Incorrect password. Deletion failed." });
        }
    
        // Delete user if password matches
        await RegisterUser.findByIdAndDelete(userId);

        if(!deleteUser){
            return res.status(404).json({success:false,message:"Unable to delete the user profile"})
        }else{
            return res.status(200).json({success:true,message:"Deleted successully"})
        }
    } catch (error) {
        return res.status(400).json({sucess:false,message:"error,err"})
    }
}


//Appointment Booking
//book appointment
const bookAppointment = async (req, res) => {
   
  try {
    const { doctorId, date, time, reason } = req.body;
    const userId = req.user.id;

    // Verify the doctor exists
    const doctor = await RegisterDoctor.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor" });
    }

    // // Check if the doctor has the date and slot available
    // const dateSlot = doctor.availableSlots.find(slot => slot.date === date);
    // if (!dateSlot || !dateSlot.times.includes(time)) {
    //   return res.status(400).json({ message: "This slot is not available" });
    // }

    // Check if the appointment slot is already booked
    const existingAppointment = await Appointment.findOne({ 
      doctor: doctorId,
      date, 
      time,
      status: { $in: ["pending", "confirmed"] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked. Please choose another time." });
    }

    // Create new appointment
    const newAppointment = new Appointment({ 
      user: userId, 
      doctor: doctorId, 
      date, 
      time, 
      reason 
    });
    
    await newAppointment.save();

    res.status(201).json({ 
      message: "Appointment booked successfully! Waiting for doctor's confirmation.", 
      appointment: newAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }

}


//get My appointments
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

        // Only allow if role is 'user'
        if (userRole !== "patient") {
          return res.status(403).json({ message: "Access denied. Only users can view their appointments." });
        }

    const appointments = await Appointment.find({user: userId})
      .populate("user", "fullName email")
      .populate({
        path: "doctor",
        select: "fullName department",
        populate: {
          path: "department",
          select: "name" // Make sure your Department schema has a 'name' field
        }
      })      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};



//Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    
    const appointment = await Appointment.findById(req.params.id);
    console.log (appointment)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify this appointment belongs to the user or the user is a doctor/admin
    if (appointment.user.toString() !== userId && 
        req.userRole !== "admin" && 
        (req.userRole === "doctor" && appointment.doctor.toString() !== userId)) {
      return res.status(403).json({ message: "You are not authorized to cancel this appointment" });
    }

    // Only allow cancellation of pending or confirmed appointments
    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res.status(400).json({ message: `Cannot cancel an appointment that is already ${appointment.status}` });
    }
    appointment.status = "canceled";
    await appointment.save();

    let notiContent;
    if(appointment.status === "canceled"){
      notiContent = "Appointment was canceled by patient."
    }

    const createNoti =  await Notification.create({
      //this is for doctor 
      userId: appointment.user,
      doctorId: appointment.doctor,
      userType:"doctor",
      notificationType:appointment.status,
      content:notiContent
    })

    if(appointment.status ==="canceled"){
      await createNoti.save()
    }

    res.status(200).json({ 
      message: "Appointment canceled successfully", 
      appointment 
    });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment", error: error.message });
  }
};


//get date and time for selected doctor
const getAvailableSlots = async (req, res) => {
  try {
    
    const doctor = await RegisterDoctor.find({ role: "doctor", availableSlots: { $exists: true, $not: { $size: 0 } } }).select("availableSlots") 

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available doctors", error: error.message });
  }
};




//get all doctors
const getAllDoctors = async(req,res) => {
  try{
    const doctors = await RegisterDoctor.find().populate('department', 'name');

    res.status(200).json({success:true, message:"Fetch successfull", data:doctors})
  } catch(error){
    res.status(500).json({success:false, message: "Error fetching available doctors", error: error.message })
  }
};


//get doctor by id
const getDoctorById = async(req,res) => {
  try{
    const doctorId = req.params.doctorId;

    const doctor = await RegisterDoctor.findById(doctorId).populate("department","name");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch(error){
    res.status(500).json({ message: "Error fetching doctor", error: error.message })
  }
}


//get departments
const getDepartments = async(req,res) => {
  try{
    const departments = await Department.find().select("name");

    res.status(200).json(departments)
  } catch(error){
    res.status(500).json( {message: "Error fetching departments", error: error.message} )
  }
}


//REMINDERS
const setReminders = async (req, res) => {
  try {
    const { userEmail, patientName, doctorName, department, date, time, sendAt } = req.body;

    if (!userEmail || !patientName || !doctorName || !department || !date || !time || !sendAt) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const reminder = await Reminder.create({
      userEmail,
      patientName,
      doctorName,
      department,
      date,
      time,
      sendAt
    });

    res.status(201).json({ message: 'Reminder created successfully!', reminder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


//change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userId; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await RegisterUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//forgot password
const forgotPassword = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let account = await RegisterUser.findOne({ email });
    let role = 'patient';

    if (!account) {
      account = await RegisterDoctor.findOne({ email });
      role = 'doctor';
    }

    if (!account) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: account._id, role }, process.env.JWT_SECRET, { expiresIn: '5m' });

    // send mail with token
    passwordResetMail(account.email, token);

    res.status(200).json({
      success: true,
      message: "Verification link has been sent to your email",
      token
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//reset password- change
const pwChange = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || !token) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const { id, role } = decoded;

    let account;

    if (role === 'patient') {
      account = await RegisterUser.findById(id);
    } else if (role === 'doctor') {
      account = await RegisterDoctor.findById(id);
    } else {
      return res.status(400).json({ success: false, message: "Invalid user role" });
    }

    if (!account) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    account.password = hashedPassword;

    await account.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



//checkpay status
const checkpayment= async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Missing apt id' });
    }

    const payment = await AppointmentPayment.findOne({
      appointment: appointmentId,
      paymentStatus: 'completed',
    });

    if (payment) {
      return res.status(200).json({ success: true, message: 'Payment completed', payment });
    } else {
      return res.status(404).json({ success: false, message: 'No payment found' });
    }
  } catch (error) {
    console.error('Error checking payment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports={registerUser, verifyEmail, loginUser, getUserById, editUserData, deleteUserData,
                 bookAppointment, cancelAppointment, getAvailableSlots, getAllDoctors,
                  getDepartments, getDoctorById, getMyAppointments, setReminders, changePassword, forgotPassword, pwChange, checkpayment};


