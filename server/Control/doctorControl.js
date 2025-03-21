const {RegisterDoctor} = require("../Schema/registerSchema") //imported schema
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//Register function for Doctor
const registerDoctor = async(req,res)=>{
    try{
        const {fullName,email,password,contact,department} = req.body
  
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


//login Doctor
const loginDoctor = async (req, res) => {
    try {
  
      console.log(req.body);
  
      //Extract email and password from request
      const { email, password } = req.body;
  
      // To find user in the database
      const user = await RegisterDoctor.findOne({ email });
  
      // If user not found or password is incorrect, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // If user is found and password is correct, generate token and return
      const token = jwt.sign({ id: user._id, role:user.role }, process.env.JWT_SECRET);
      return res.status(200).json({ message: 'logged in successfully', token, user });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };


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



module.exports = {registerDoctor, loginDoctor, doctorSlotsPost};