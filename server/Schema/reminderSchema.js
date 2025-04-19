// reminderSchema.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userEmail: String,
  patientName: String,
  doctorName: String,
  department: String,
  date: String,
  time: String,
  sendAt: Date,
  isSent: {
    type: Boolean,
    default: false
  }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = { Reminder };
