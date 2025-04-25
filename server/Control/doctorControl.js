const {RegisterDoctor, RegisterUser} = require("../Schema/registerSchema") //imported schema
const {Appointment} = require("../Schema/appointmentSchema")
const {Notification} = require("../Schema/notificationSchema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// //login Doctor
// const loginDoctor = async (req, res) => {
//     try {
  
//       console.log(req.body);
  
//       //Extract email and password from request
//       const { email, password } = req.body;
  
//       // To find user in the database
//       const user = await RegisterDoctor.findOne({ email });
  
//       // If user not found or password is incorrect, return error
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(400).json({ message: 'Invalid email or password' });
//       }
  
//       const passwordMatch = await bcrypt.compare(password, user.password);
  
//       if (!passwordMatch) {
//         return res.status(400).json({ message: "Invalid email or password" });
//       }
  
//       // If user is found and password is correct, generate token and return
//       const token = jwt.sign({ id: user._id, role:user.role }, process.env.JWT_SECRET);
//       return res.status(200).json({ message: 'logged in successfully', token, user });
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   };



  //post time/date slots
  const doctorSlotsPost = async (req, res) => {
    try {

      console.log("Request User:", req.user);
      const { date, times } = req.body;
      const doctorId = req.user.id;
  
      // Find the doctor 
      const doctor = await RegisterDoctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      // Check if there's already a slot for this date
      const existingSlotIndex = doctor.availableSlots.findIndex(
        slot => slot.date === date
      );
  
      if (existingSlotIndex >= 0) {
        // Update existing slot
        doctor.availableSlots[existingSlotIndex].times = times;
      } else {
        // Add new slot
        doctor.availableSlots.push({ date, times });
      }
  
      await doctor.save();
  
      res.status(201).json({ 
        message: "Appointment slots added successfully", 
        availableSlots: doctor.availableSlots 
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding appointment slots", error: error.message });
    }
  };


//Update appointment status (confirm/reject)
const appointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const doctorId = req.userId;
    
    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(req.params.id);
    console.log (appointment)
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify this appointment belongs to the doctor
    if (String(appointment.doctor) !== String(doctorId)) {
      return res.status(403).json({ message: "You are not authorized to update this appointment" });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    
    await appointment.save();

    let notiContent;
    if(appointment.status === "confirmed"){
      notiContent = "You appointment is confirmed"
    }else if (appointment.status === "rejected"){
      notiContent = "You appointment is reject"
    }

    const createNoti =  Notification.create({
      //this is for user 
      userId: appointment.user,
      doctorId: appointment.doctor,
      userType:"patient",
      notificationType:appointment.status,
      content:notiContent
    })
    
    if(appointment.status ==="confirmed" || appointment.status==="rejected"){
      (await createNoti).save()
    }
    
    res.status(200).json({ 
      success:true,
      message: `Appointment ${status}`, 
      appointment 
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment status", error: error.message });
  }
};

// Get current user profile
const getMeDoctor = async (req, res) => {
  try {

    const doctor= await RegisterDoctor.findById(req.userId)

    if(!doctor){
      return res.status(404).send({ message: "doctor does not exist", sucess: false });    
    }

    doctor.password = undefined; // Hide password before sending response

    res.status(200).json({
      id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      role: req.userRole,
      contact: doctor.contact,
      department: doctor.department,
      availableSlots: doctor.availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting user profile", error: error.message });
  }
};


//Get Assigned Appointments
const getAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    
    let appointments;

    if(userRole == "doctor"){
      appointments = await Appointment.find({doctor: userId})
      .populate("user", "fullName email")
      .populate("doctor", "fullName department");
    }
      
    if (!appointments) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment details", error: error.message });
  }
};





module.exports = { doctorSlotsPost, appointmentStatus, getMeDoctor, getAppointments};