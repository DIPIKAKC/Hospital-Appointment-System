const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "RegisterUser", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "RegisterDoctor", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "rejected", "canceled"], 
    default: "pending" 
  },
  notes: { type: String },
  reason: { type: String, required: true },
  reminder: {type: String, },
  paymentStatus: { //FOR PAY
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  transactionId: String
  
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = {Appointment};