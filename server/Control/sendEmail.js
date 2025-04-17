const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kcdipika03112061@gmail.com', // Replace with your Gmail
    pass: 'nrdj viww tzrw bska'    // Use App Password (not your real password)
  }
});

// Email options
const mailOptions = {
  from: 'MedEase kcdipika03112061@gmail.com',
  to: 'opacarophila23@gmail.com', // Replace with any email you want to send to
  subject: 'Test Email from MedEase',
  html: `
  <div style="font-family: Arial, sans-serif; padding: 16px;">
    <h2 style="color: #2e86de;">MedEase - Appointment Reminder</h2>
    <p>Hello,</p>
    <p>This is a reminder for your upcoming appointment:</p>
    <ul>
      <li><strong>Date:</strong> April 18, 2025</li>
      <li><strong>Time:</strong> 10:00 AM</li>
      <li><strong>Doctor:</strong> Dr. Jane Smith</li>
    </ul>
    <p style="margin-top: 16px;">Thank you for using <strong>MedEase</strong>!</p>
  </div>`,
  text: 'This is a test reminder email from MedEase.'
}

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Email sent:', info.response);
});

console.log("sending...")
