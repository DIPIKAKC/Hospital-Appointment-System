const {RegisterUser, RegisterDoctor} = require("../Schema/registerSchema") //imported schema
const {Appointment} =require("../Schema/appointmentSchema")
const {Department} = require("../Schema/departmentSchema")
const {Notification} = require("../Schema/notificationSchema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Reminder } = require("../Schema/reminderSchema")


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
    const user = await RegisterUser.findById({ _id: req.params.userId });

    if (!user) {
        return res.status(404).send({ message: "User does not exist", sucess: false });
    }

    user.password = undefined; // Hide password before sending response

    res.status(200).send({ success: true, data: user });
    
  } catch (error) {
      return res.status(500).send({ message: "Error getting user info", success: false, error });
  }
}


//Update user data by id
const editUserData = async(req,res)=>{
    try {
        const userId = req.params.userId
        // console.log(userId)
        const {fullName,email} = req.body

        if (password) {
          const salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(password, salt);
        }

        const editUser = await RegisterUser.findByIdAndUpdate(
          userId,
          {fullName,email},
          { new: true, runValidators: true } // Return updated document and apply validators
        );

        if(!editUser){
            return res.status(404).json({success:false,message:"Unable to edit the profile"})
        }else{
            return res.status(200).json({success:true,message:"Edited successfully"})
        }
    } catch (error) {
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



// //get available-doctors and slots
// const getAvailableDoctorsForUser = async (req, res) => {
//   try {
    
//     // const doctors = await RegisterDoctor.find({ role: "doctor", availableSlots: { $exists: true, $not: { $size: 0 } } })
//     const doctors = await RegisterDoctor.find({ role: "doctor"})
//       .select("fullName department availableSlots");

//     res.status(200).json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching available doctors", error: error.message });
//   }
// };


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
    const { userEmail, doctorName, date, time, sendAt } = req.body;

    if (!userEmail || !doctorName || !date || !time || !sendAt) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const reminder = await Reminder.create({
      userEmail,
      doctorName,
      date,
      time,
      sendAt               //: new Date(sendAt), // should be a valid ISO date
    });

    await reminder.save();
    res.status(201).json({ message: 'Reminder created successfully!', reminder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports={registerUser, loginUser, getUserById, editUserData, deleteUserData,
                 bookAppointment, cancelAppointment, getAvailableSlots, getAllDoctors,
                  getDepartments, getDoctorById, getMyAppointments, setReminders};


