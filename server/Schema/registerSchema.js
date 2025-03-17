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
    role: { type: String, enum: ["doctor", "patient"], default: "patient" }
    },

 { timestamps: true 
})

const RegisterUser= mongoose.model('RegisterUser', register1);

module.exports = {RegisterUser};