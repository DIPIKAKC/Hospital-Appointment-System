const {RegisterAdmin, RegisterDoctor} = require("../Schema/registerSchema") //imported schema
const {Department} = require("../Schema/departmentSchema")

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


    
    module.exports = {registerAdmin, loginAdmin, getMeDAdmin, addDepartments, registerDoctor}