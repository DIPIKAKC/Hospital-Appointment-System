const mongoose = require("mongoose")

//register schema for user
const register1 = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { 
        type: String,
        required: true,     // Ensures the email field is required
        unique: true,       // Ensures uniqueness of email addresses
        trim: true,         // Removes leading and trailing whitespace
        lowercase: true,    // Converts the email to lowercase before saving
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validates the format of the email address using a regular expression
    },
    password: {  
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"] // Minimum password length requirement
    },
    role: { 
        type: String,
        enum: ["doctor", "patient"],
        default: "patient"
    }
    },

 { timestamps: true 
})


//register schema for doctor
const register2 = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { 
        type: String,
        required: true,     
        unique: true,       
        trim: true,         
        lowercase: true,    
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    password: {  
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"] 
    },
    role: { 
        type: String,
        enum: ["doctor", "patient"],
        default: "doctor" 
    },
    contact: {type:String, required:true},
    department: {
        type:String,
        required:true
    },
    availableSlots: [{
        date: { type: String },
        times: [{ type: String }]    
    }]
    },

 { timestamps: true });



//register schema for admin
const register3 = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { 
        type: String,
        required: true,     // Ensures the email field is required
        unique: true,       // Ensures uniqueness of email addresses
        trim: true,         // Removes leading and trailing whitespace
        lowercase: true,    // Converts the email to lowercase before saving
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validates the format of the email address using a regular expression
    },
    password: {  
        type: String,
        required: true,
        minlength: 8 // Minimum password length requirement
    },
    role: { type: String, default: "admin" }
    },

 { timestamps: true 
})



const RegisterUser= mongoose.model('RegisterUser', register1);
const RegisterDoctor= mongoose.model('RegisterDoctor', register2);
const RegisterAdmin= mongoose.model('RegisterAdmin', register3);

module.exports = {RegisterUser, RegisterDoctor, RegisterAdmin};