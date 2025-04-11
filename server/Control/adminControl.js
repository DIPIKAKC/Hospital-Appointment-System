const {RegisterAdmin, RegisterDoctor, RegisterUser} = require("../Schema/registerSchema") //imported schema
const {Department} = require("../Schema/departmentSchema")
const {Appointment} = require("../Schema/appointmentSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



//Register function for admin
const registerAdmin = async(req,res)=>{
    try{
        const {fullName,email,password} = req.body
  
        if (!password || password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
  
        console.log(req.body)
        const salt = await bcrypt.genSalt(10) //generating salt
        const hashedPassword = await bcrypt.hash(password,salt) 
  
        const user = await RegisterAdmin.create({
            fullName,
            email: email, 
            password: hashedPassword,
            role: "admin"
        })
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


//login function for admin
const loginAdmin = async (req, res) => {
    try {
      //Extract email and password from request
      const { email, password } = req.body;
  
      // To find user in the database
      const user = await RegisterAdmin.findOne({ email });
  
      // If user not found or password is incorrect, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // If user is found and password is correct, generate token and return
      const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET);
      return res.status(200).json({ message: 'logged in successfully', token, user: {userId: user._id, fullName: user.fullName, email: user.email, role: user.role }});
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };


//get myself

const getMeDAdmin = async (req, res) => {
  try {

    const admin= await RegisterAdmin.findById(req.userId)

    if(!admin){
      return res.status(404).send({ message: "admin does not exist", sucess: false });    
    }

    admin.password = undefined; // Hide password before sending response

    res.status(200).json({
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: req.userRole,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting user profile", error: error.message });
  }
};






//Register function for Doctor
const registerDoctor = async(req,res)=>{
  try{
    const {fullName,email,password,contact,department, description, experience} = req.body
    
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    if(!department || !email || !fullName || !contact){
      return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if email already exists
        const existingDoctor = await RegisterDoctor.findOne({ email });
        if (existingDoctor) {
          return res.status(400).json({ message: "Doctor with this email already exists" });
        }
        
        console.log(req.body)
        
        const salt = await bcrypt.genSalt(10) //generating salt
        const hashedPassword = await bcrypt.hash(password,salt) 
        
        const user = await RegisterDoctor.create({
          fullName,
          email: email, 
          password: hashedPassword,
          contact,
          department,
          description,
          experience,
          role: "doctor"
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
    
    
    const addDepartments = async(req,res) => {
      try{
        const {name,description} = req.body
    
    // Check if department already exists
        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(400).json({ success: false, message: "Department already exists" });
          }
    
        const newdepartment = await Department.create({
            name: name,
            description: description
        })
    
        if(newdepartment){
            res.status(200).json({message:'Successfully added department'})
        }else{
            res.status(400).json({message:"Error adding department."})
        }
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
    }


// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "fullName email")
      .populate("doctor", "fullName department")
      .sort({ createdAt: -1 });
      
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

//delete apointments
const adminDeleteAppointment = async (req, res) => {
  try {
    const appId = req.params.id;
    console.log("Incoming ID:", appId);

    const found = await Appointment.findById(appId);
    console.log("Appointment found before delete:", found);

    const deleted = await Appointment.findByIdAndDelete(appId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({ success: true, message: `Appointment id: ${appId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await RegisterUser.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};


//get all doctors
const getAdminDoctors = async (req, res) => {
  try {
    const doctors = await RegisterDoctor.find().select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};

//update doctors
// const adminDeleteDoctors = async (req, res) => {
//   try {
//     const doctorId = req.params.id;
//     console.log("Incoming ID:", doctorId);

//     const foundDoctor = await RegisterDoctor.findById(doctorId);
//     console.log("Appointment found before delete:", foundDoctor);

//     const deletedDoctor = await RegisterDoctor.findByIdAndDelete(doctorId);

//     if (!deletedDoctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     return res.status(200).json({ success: true, message: `Doctor id: ${doctorId} deleted successfully` });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };



//delete doctors
const adminDeleteDoctors = async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log("Incoming ID:", doctorId);

    const foundDoctor = await RegisterDoctor.findById(doctorId);
    console.log("Appointment found before delete:", foundDoctor);

    const deletedDoctor = await RegisterDoctor.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({ success: true, message: `Doctor id: ${doctorId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//get all Departments
const getAdminDepartments = async (req, res) => {
  try {
    const doctors = await Department.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};

    module.exports = {registerAdmin, loginAdmin, getMeDAdmin, addDepartments, registerDoctor, getAllAppointments, 
      getAllUsers, getAdminDoctors, getAdminDepartments, adminDeleteAppointment, adminDeleteDoctors}