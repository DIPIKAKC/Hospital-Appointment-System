const mongoose = require('mongoose');
const cron = require('node-cron');
const { Reminder } = require('../Schema/reminderSchema');
const { reminderEmail } = require('./reminderEmail');

// const mongoURI = "mongodb+srv://dipikak0323:MedEase@cluster0.a8q9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// console.log(mongoURI);

// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }).then(() => console.log("Connected to MongoDB  for reminder scheduler"))
//     .catch(err => console.log("Error connecting to MongoDB:", err));

// Cron job
cron.schedule('* * * * *', async () => {
  console.log("Checking reminders...");

  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000); // 1 minute earlier

  try {
    const reminders = await Reminder.find({
      sendAt: {        
        $gte: oneMinuteAgo,
        $lte: now
      },
      isSent: false
    });

    if (reminders.length === 0) {
        console.log("No pending reminders.");
    }

    for (const reminder of reminders) {
      await reminderEmail(reminder.userEmail, {
        subject: `Reminder: Appointment on ${reminder.date}`,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #2e86de;">MedEase - Appointment Reminder</h2>
          <p>Dear <strong>${reminder.patientName}</strong>,</p>
          <p>This is a reminder for your upcoming appointment:</p>
          <ul>
            <li><strong>Doctor:</strong> Dr. ${reminder.doctorName}</li>
            <li><strong>Department:</strong> ${reminder.department}</li>
            <li><strong>Date:</strong> ${reminder.date}</li>
            <li><strong>Time:</strong> ${reminder.time}</li>
          </ul>
          <p style="margin-top: 16px;">Thank you for using <strong>MedEase</strong>!</p>
        </div>
      `
      });

      reminder.isSent = true;
      await reminder.save();

      console.log(`Email sent to ${reminder.userEmail}`);
    }

  } catch (err) {
    console.error("Error in reminder cron job:", err);
  }
});
