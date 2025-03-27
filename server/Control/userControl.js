const {RegisterUser, RegisterDoctor} = require("../Schema/registerSchema") //imported schema
const {Appointment} =require("../Schema/appointmentSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


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
    try {
      //Extract email and password from request
      const { email, password } = req.body;
  
      // To find user in the database
      const user = await RegisterUser.findOne({ email });
  
      // If user not found or password is incorrect, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      
      // If user is found and password is correct, generate token and return
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

      return res.status(200).json({ message: 'logged in successfully', token, userId: user._id, fullName: user.fullName, email: user.email, role: user.role });
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

    // // Check if the doctor has the requested slot available
    // const dateSlot = doctor.availableSlots.find(slot => slot.date === date);
    // if (!dateSlot || !dateSlot.times.includes(time)) {
    //   return res.status(400).json({ message: "This slot is not available" });
    // }

    // // Check if the appointment slot is already booked
    // const existingAppointment = await Appointment.findOne({ 
    //   doctor: doctorId,
    //   date, 
    //   time,
    //   status: { $in: ["pending", "confirmed"] }
    // });
    
    // if (existingAppointment) {
    //   return res.status(400).json({ message: "This slot is already booked. Please choose another time." });
    // }

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



//Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    
    const appointment = await Appointment.findById(req.params.id);
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

    res.status(200).json({ 
      message: "Appointment canceled successfully", 
      appointment 
    });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment", error: error.message });
  }
};



//get available-doctors and slots
const getAvailableDoctorsForUser = async (req, res) => {
  try {
    const doctors = await RegisterDoctor.find({ role: "doctor", availableSlots: { $exists: true, $not: { $size: 0 } } })
      .select("fullName department availableSlots");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available doctors", error: error.message });
  }
};

module.exports={registerUser, loginUser, getUserById, editUserData, deleteUserData, bookAppointment, cancelAppointment, getAvailableDoctorsForUser};


