const mongoose = require('mongoose');

const appointmentPaymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 500 // Static fee
    },
    paymentMethod: {
      type: String,
      enum: ['khalti'],
      required: true
    },
    pidx: {
      type: String,
      unique: true,
    },
    paymentUrl: {
      type: String
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    paidAt: {
      type: Date
    },
    patientName: String,          
    doctorName: String,        
    department: String,    
    appointmentDate: String,   
    appointmentTime: String,
  },
  { timestamps: true }
);

const AppointmentPayment = mongoose.model('AppointmentPayment', appointmentPaymentSchema);
module.exports = {AppointmentPayment};
