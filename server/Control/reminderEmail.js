const nodemailer = require('nodemailer');
const { Reminder } = require('../Schema/reminderSchema');

// send reminder
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dipikak0323@gmail.com', 
    pass: 'xnsr jief lpfu gpbx'    // App Password
  }
});

async function reminderEmail(to, { subject, html }) {
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

module.exports={reminderEmail}