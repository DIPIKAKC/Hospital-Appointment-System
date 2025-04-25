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


//email
const verifyEmailMail = async (email, token) => {
  const mailOptions = {
    from: `MedEase <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - MedEase',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - MedEase</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 20px 0;">
              <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
                
                <!-- Header with logo -->
                <tr>
                  <td style="background-color: #1E40AF; padding: 20px 30px; text-align: center;">
                    <img src="${process.env.LOGO_URL}" alt="MedEase" width="180" style="display: block; margin: 0 auto;">
                  </td>
                </tr>

                <!-- Main content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #1E40AF; font-size: 24px;">Email Verification</h2>
                    
                    <p style="margin: 0 0 20px; font-size: 16px;">Dear User,</p>
                    
                    <p style="margin: 0 0 20px; font-size: 16px;">Thank you for registering with MedEase! To complete your registration, please verify your email address by clicking the button below:</p>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color: #1E40AF; border-radius: 6px; text-align: center; padding: 15px;">
                          <a href="http://localhost:3000/verify-email?t=${token}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">Verify Email</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 0; font-size: 14px; color: #555;">If you didn’t request this, please ignore this email.</p>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #555;">This verification link is valid for a limited time.</p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MedEase. All rights reserved.</p>
                    <p style="margin: 5px 0 0;">Kathmandu, Nepal</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        reject(error);
    } else {
        resolve(info);
    }
    });
}
);
};

module.exports = {sendEmail, verifyEmailMail};