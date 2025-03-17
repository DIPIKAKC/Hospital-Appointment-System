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

