const mongoose = require("mongoose")


// Full name validator:
// - Must start with a letter
// - Can include letters and numbers
// - No spaces allowed
// - Cannot be only numbers
const registerValidator = {
    validator: function (value) {
        return /^[A-Za-z]*$/.test(value); 
        // ^           → start of string
        // [A-Za-z]    → first character must be a letter
        // $           → end of string
    },
    message: "Full name must start with a letter and cannot contain spaces or be only numbers"
};

const passwordValidator = {
    validator: function (value) {
      // Return false if it contains any whitespace
      return new RegExp('^(?!^\\s*$).+$').test(value);
    },
    message: "Password must not contain spaces"
  }



//register schema for user
const register1 = mongoose.Schema({
    fullName: { type: String, required: true, validate: registerValidator },
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
        minlength: [8, "Password must be at least 8 characters long"], // Minimum password length requirement,
        validate: passwordValidator
    },
    dateOfBirth:{
        type: String,
    },
    gender:{
        type: String,
        enum:["Male", "Female"]
    },
    contact:{
        type: String,
    },
    profile:{
        type:String,
    },
    address:{
        type:String
    },
    role: { 
        type: String,
        enum: ["doctor", "patient"],
        default: "patient"
    },
    verified: {
        type: Boolean,
        default: false
      }      
    },

 { timestamps: true 
})


//register schema for doctor
const register2 = mongoose.Schema({
    fullName: { type: String, required: true, validate: registerValidator },
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
    department: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Department
        ref: 'Department', // Referencing the Department model
    },
    experience: { type: String},
    dateOfBirth:{
        type: String,
    },
    gender:{
        type: String,
        enum:["Male", "Female"]
    },
    address:{
        type: String
    },
    profile:{
        type:String,
    },
    contact:{
        type: String,
    },
    description: { type: String},
    availableSlots: [{
        date: { type: String },
        times: [{ type: String }]    
    }],
    doctorfee:{
        type: Number,
        required:true
    },
    verified: {
        type: Boolean,
        default: false
    }    
    },

 { timestamps: true });



//register schema for admin
const register3 = mongoose.Schema({
    fullName: { type: String, required: true, validate: registerValidator },
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
        minlength: 8, // Minimum password length requirement
    },
    role: { type: String, default: "admin" },
    verified: {
        type: Boolean,
        default: false
      } 
    },

 { timestamps: true 
})



const RegisterUser= mongoose.model('RegisterUser', register1);
const RegisterDoctor= mongoose.model('RegisterDoctor', register2);
const RegisterAdmin= mongoose.model('RegisterAdmin', register3);

module.exports = {RegisterUser, RegisterDoctor, RegisterAdmin};