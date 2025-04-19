const nodemailer = require('nodemailer');
const { Reminder } = require('../Schema/reminderSchema');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kcdipika03112061@gmail.com', // Replace with your Gmail
    pass: 'nrdj viww tzrw bska'    // Use App Password (not your real password)
  }
});

async function sendEmail(to, { subject, html }) {
  const mailOptions = {
    from: `MedEase kcdipika03112061@gmail.com`,
    to,
    subject,
    html,
    text: 'This is an appointment reminder from MedEase.'
  };

  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmail;