const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },      
    time: { type: String, required: true },      
    isSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    sendAt: { type: Date, required: true }        
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports={Reminder}