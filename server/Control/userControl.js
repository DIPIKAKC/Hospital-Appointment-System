const {RegisterUser} = require("../Schema/registerSchema") //imported schema
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


//Register function for user
const registerUser = async(req,res)=>{
    try{
        const {fullName,email,password} = req.body

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
      const { email, password} = req.body;
  
      // To find user in the database
      const user = await RegisterUser.findOne({ email });
  
      // If user not found or password is incorrect, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      
      // If user is found and password is correct, generate token and return
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      return res.status(200).json({ message: 'logged in successfully', token, userId: user._id,  role: user.role });
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





module.exports={registerUser, loginUser, getUserById};
