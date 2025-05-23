const {RegisterDoctor, RegisterUser} = require("../Schema/registerSchema") //imported schema
const {Appointment} = require("../Schema/appointmentSchema")
const {Notification} = require("../Schema/notificationSchema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { registerDoctor } = require("./adminControl")
const { sendAppointmentStatusEmail } = require("./sendEmail")
const { uploadOnCloudinary } = require("../utils/Cloudinary")


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


//email verification
const verifyDoctorEmail = async (req, res) => {
  try{
  const { token } = req.params;
  if (!token) {
      res.status(500).json(400, "Token is required");
      
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(400).json({success: false, message: "Token is required"});
  }

  

  const user = await RegisterDoctor.findById(decoded.id);
  if (!user) {
    res.status(404).json({success: false, message: "Doctor not found"});
  }

  user.verified = true;
  await user.save();

  res.status(200).json({success:true, message:"Email verified Successfully"})
  }catch(error){
    res.status(500).json({success:false, message: error.message})
  }
};



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

    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor", "fullName _id")
      .populate("user", "fullName email _id");

    console.log (appointment);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify this appointment belongs to the doctor
    if (String(appointment.doctor._id) !== String(doctorId)) {
      return res.status(403).json({ message: "You are not authorized to update this appointment" });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    
        // Send email to patient
    sendAppointmentStatusEmail(
      appointment.user.email,
      appointment.doctor.fullName,
      appointment.user.fullName,
      appointment.date, // assuming appointment.date is in string or Date format
      appointment.time, // assuming appointment.time is available
      status,
      notes || "No additional notes"
    );
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

    const doctor= await RegisterDoctor.findById(req.userId).populate("department","name");

    if(!doctor){
      return res.status(404).send({ message: "doctor does not exist", sucess: false });    
    }

    doctor.password = undefined; // Hide password before sending response

    res.status(200).json({
      id: doctor._id,
      fullName: doctor.fullName,
      description:doctor.description,
      email: doctor.email,
      role: req.userRole,
      contact: doctor.contact,
      address: doctor.address,
      department: doctor.department.name,
      dateOfBirth: doctor.dateOfBirth,
      gender: doctor.gender,
      availableSlots: doctor.availableSlots,
      profile: doctor.profile
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting user profile", error: error.message });
  }
};

//Update doctor data by id
const editDoctorData = async(req,res)=>{
  try {
      const doctorId = req.params.id;
      console.log(doctorId)
      
      const {fullName,email, contact, dateOfBirth, gender, address} = req.body

      const image =  req.file ? req.file.path : null;
      console.log("IMAGE",image)

      const updateFields = {};
      if (fullName) updateFields.fullName = fullName;
      if (email) updateFields.email = email;
      if (contact) updateFields.contact = contact;
      if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
      if (gender) updateFields.gender = gender;
      if (address) updateFields.address = address;

      
      const uploadImage =await uploadOnCloudinary("doctor", image)
      console.log(uploadImage)

      if(image && uploadImage){
        updateFields.profile = uploadImage.secure_url
      }


      const editDoctor = await RegisterDoctor.findByIdAndUpdate(
        doctorId,
        updateFields,
        { new: true, runValidators: true } // Return updated document and apply validators
      );

      if(!editDoctor){
          return res.status(404).json({success:false,message:"Unable to edit the profile"})
      }else{
          return res.status(200).json({success:true,message:"Edited successfully"})
      }
  } catch (error) {
      return res.status(400).json({success:false,message:error.message})
  }
}


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

//Get appointment stats
const getAppointmentStats = async (req, res) => {
  try {

    const doctorId = req.userId;
    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    // const now = new Date(); // Current date and time

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of next day
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    //Appointments on today
    const todayCount = await Appointment.countDocuments({
     doctor:doctorId,
     date: { $gte: todayStr },
     status: "confirmed" && !'pending' && !'canceled'
    });

    //Upcoming appointments (after today)
    const upcomingCount = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gt: tomorrowStr },
      status: 'confirmed'
    });

    // Unique patients who booked any appointments
    const uniquePatients = await Appointment.distinct('user',{
      doctor:doctorId
    })
    const totalPatients = uniquePatients.length;

    //Pending requests from now (current date and time onward)
    const pendingRequestsCount = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gte: todayStr },
      status: 'pending' && !'canceled'
    });

    res.status(200).json({
      doctorId: doctorId,
      todayAppointments: todayCount,
      upcomingAppointments: upcomingCount,
      totalPatientsWithAppointments: totalPatients,
      pendingReqFromNow:pendingRequestsCount,
    });

  } catch (err) {
    console.error('Error fetching appointment stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


//get patient records
const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.id; // Assuming JWT middleware sets this

    // for only full name and email
    // Get distinct user IDs who booked appointments with this doctor
    // const patientIds = await Appointment.distinct('user', {
    //   doctorId: doctorId
    // });
// 
    // // Fetch user details for those IDs
    // const patients = await RegisterUser.find(
    //   { _id: { $in: patientIds } },
    //   { fullName: 1, email: 1 } // return only necessary fields
    // );

    //For patients and appt info
    // Find all appointments for this doctor
    const appointments = await Appointment.find({doctorId}).populate('user', ' _id fullName email');

    // Group by unique patients and find their latest appointment
    const patientMap = new Map();

    for (const appt of appointments) {
      const id = appt.user?._id;
      if (!patientMap.has(id) || new Date(appt.date) > new Date(patientMap.get(id).lastVisit)) {
        patientMap.set(id, {
          name: appt.user?.fullName,
          email: appt.user?.email,
          lastVisit: appt.date,
          condition: appt.reason || 'General Checkup' // Customize as needed
        });
      }
    }

    // Convert to array and sort by lastVisit descending
    const patients = Array.from(patientMap.values())
    .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
    .slice(0, 2); // Get only the 2 most recent

    res.status(200).json({ patients });
  } catch (err) {
    console.error('Error fetching my patients:', err);
    res.status(500).json({ error: err.message });
  }
};

//change password
const changePwDoc = async (req, res) => {
  try {
    const doctorId = req.userId; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const doctor = await RegisterDoctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(newPassword, salt);

    await doctor.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { doctorSlotsPost, appointmentStatus, getMeDoctor, getAppointments,getAppointmentStats, 
  getMyPatients, editDoctorData, changePwDoc, verifyDoctorEmail};