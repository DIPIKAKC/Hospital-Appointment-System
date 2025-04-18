const mongoose = require('mongoose');
const cron = require('node-cron');
const sendEmail = require('./sendEmail');
const { Reminder } = require('../Schema/reminderSchema');

const mongoURI = "mongodb+srv://dipikak0323:MedEase@cluster0.a8q9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(mongoURI);

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// Cron job
cron.schedule('* * * * *', async () => {
  console.log("Checking reminders...");

  const now = new Date();

  try {
    const reminders = await Reminder.find({
      sendAt: { $lte: now },
      isSent: false
    });

    if (reminders.length === 0) {
        console.log("No pending reminders.");
    }

    for (const reminder of reminders) {
      await sendEmail(reminder.userEmail, {
        subject: `⏰ Reminder: Appointment on ${reminder.date}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 16px;">
            <h2 style="color: #2e86de;">MedEase - Appointment Reminder</h2>
            <p>Hello,</p>
            <p>This is a reminder for your upcoming appointment:</p>
            <ul>
              <li><strong>Date:</strong> ${reminder.date}</li>
              <li><strong>Time:</strong> ${reminder.time}</li>
              <li><strong>Doctor:</strong> ${reminder.doctorName}</li>
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
