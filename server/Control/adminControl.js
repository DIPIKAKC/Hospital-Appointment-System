const {RegisterAdmin, RegisterDoctor, RegisterUser} = require("../Schema/registerSchema") //imported schema
const {Department} = require("../Schema/departmentSchema")
const {Appointment} = require("../Schema/appointmentSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Resource } = require("../Schema/resourceSchema")
const { verifyEmailMail } = require("./sendEmail")



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

//verify admin 
const verifyAdminEmail = async (req, res) => {
  try{
  const { token } = req.params;
  if (!token) {
      res.status(500).json(400, "Token is required");
      
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(400).json({success: false, message: "Token is required"});
  }

  

  const user = await RegisterAdmin.findById(decoded.id);
  if (!user) {
    res.status(404).json({success: false, message: "Admin not found"});
  }

  user.verified = true;
  await user.save();

  res.status(200).json({success:true, message:"Email verified Successfully"})
  }catch(error){
    res.status(500).json({success:false, message: error.message})
  }

};


//login function for admin
const loginAdmin = async (req, res) => {
  //Extract email and password from request
  const { email, password } = req.body;

    try {
  
      // To find user in the database
      const user = await RegisterAdmin.findOne({ email });
  
      if(!user.verified){
        return res.status(404).json({success:false, message: 'Email not verified' });
      }
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
    const {fullName,email,password,contact,department, description, experience, doctorfee} = req.body
    
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
          doctorfee,
          role: "doctor"
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
      .populate({
        path: "doctor",
        select: "fullName department",
        populate: {
          path: "department",
          select: "name", 
        }
      })
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
    const users = await RegisterUser.find().select("-password")
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

//delete user by id
const adminDeleteUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Incoming ID:", userId);

    const foundUser = await RegisterUser.findById(userId);
    console.log("Appointment found before delete:", foundUser);

    const deletedUser = await RegisterUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: `User id: ${userId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await RegisterDoctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//update doctors
const adminUpdateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const updatedData = req.body;

    const updatedDoctor = await RegisterDoctor.findByIdAndUpdate(doctorId, updatedData, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ success:true, message: 'doctor updated successfully' , doctordata: updatedData});
  } catch (err) {
    res.status(500).json({ message: 'Failed to update doctor', error: err.message });
  }
};



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
    console.log(doctors)
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};


//update doctors
const adminUpdateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const updatedData = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(departmentId, updatedData, { new: true });

    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ success:true, message: 'department updated successfully' , doctordata: updatedData});
  } catch (err) {
    res.status(500).json({ message: 'Failed to update department', error: err.message });
  }
};



//delete departments
const adminDeleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    console.log("Incoming ID:", departmentId);

    const foundDepartment = await Department.findById(departmentId);
    console.log("Appointment found before delete:", foundDepartment);

    const deletedDepartment = await Department.findByIdAndDelete(departmentId);

    if (!deletedDepartment) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, message: `Department id: ${departmentId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



//get counts
const getStats = async (req, res) => {
  try {
    const usersCount = await RegisterUser.countDocuments({ role: 'patient' });
    const doctorsCount = await RegisterDoctor.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const deaprtmentsCount = await Department.countDocuments();
    const resourcesCount = await Resource.countDocuments();

    res.json({
      users: usersCount,
      doctors: doctorsCount,
      appointments: appointmentsCount,
      departments: deaprtmentsCount,
      resources: resourcesCount
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};



//post/create new resources
const addResource = async (req, res) => {
  try {

    const {type, total, available} = req.body

    // Validation: available must not be greater than total
    if (available > total) {
      return res.status(400).json({
        success: false,
        message: '`available` cannot be greater than `total`'
      });
    }

    const existingResource = await Resource.findOne({type});
    if (existingResource) {
      return res.status(400).json({success:false, message: 'Resource already exists' });
    }

    const newResource = await Resource.create({
      type,
      total,
      available,
      lastUpdated: new Date()
    })    
    await newResource.save();

    if(newResource){
      res.status(200).json({success:true, message:'Successfully added resource'})
    }else{
      res.status(400).json({success:false, message:"Error adding resource."})
    }
  } catch (error) {
    res.status(400).json({ message: 'Creation failed', error: error.message });
  }
};


//update resources
const updateResource = async (req, res) => {
  try {

    const resourceId = req.params.id;
    const updatedData = req.body;

    const newTotal = updatedData.total !== undefined ? updatedData.total : existingResource.total;
    const newAvailable = updatedData.available !== undefined ? updatedData.available : existingResource.available;

    if (newAvailable > newTotal) {
      return res.status(400).json({
        success: false,
        message: '`available` cannot be greater than `total`'
      });
    }
    updatedData.lastUpdated = new Date(); // update lastUpdated timestamp

    
    const updatedResource = await Resource.findByIdAndUpdate(resourceId, updatedData,{ new: true });

    if(!updatedResource){
      return res.status(400).json({ succes:false,message: 'Failed to update resource' });
    }
    
    res.status(200).json({ success:true, message: 'resource updated successfully' , resourcedata: updatedData});
  } catch (error) {
    res.status(400).json({ message: 'Updation failed' });
  }
};

//get resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({});
    if (!resources || resources.length === 0) {
      return res.status(404).json({ success: false, message: 'No resource found' });
    }
    res.status(200).json({success:true,resources});
  } catch (error) {
    res.status(500).json({success:false, message: 'Server error' , error:error.message});
  }
};


//delete resource
const adminDeleteResources = async (req, res) => {
  try {
    const resourceId = req.params.id;
    console.log("Incoming ID:", resourceId);

    const foundResource = await Resource.findById(resourceId);
    console.log("Appointment found before delete:", foundResource);

    const deletedResource = await Resource.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      return res.status(404).json({ success: false, message: "resource not found" });
    }

    return res.status(200).json({ success: true, message: `Resource id: ${resourceId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

    module.exports = {registerAdmin, loginAdmin, getMeDAdmin, addDepartments, registerDoctor, getAllAppointments, 
      getAllUsers, adminDeleteUsers, getAdminDoctors, getAdminDepartments, adminUpdateDepartment,adminDeleteDepartment, adminDeleteAppointment, 
      adminDeleteDoctors, adminUpdateDoctor, getDoctorById, getStats, addResource, updateResource, getResources, 
      adminDeleteResources, verifyAdminEmail}