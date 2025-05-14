const nodemailer = require('nodemailer');
const { Reminder } = require('../Schema/reminderSchema');

//email verification
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
                  <td style="background-color: #10B8B9; padding: 20px 30px; text-align: center;">
                    <img src="${process.env.LOGO_URL}" alt="MedEase" width="180" style="display: block; margin: 0 auto;">
                  </td>
                </tr>

                <!-- Main content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #10B8B9; font-size: 24px;">Email Verification</h2>
                    
                    <p style="margin: 0 0 20px; font-size: 16px;">Dear User,</p>
                    
                    <p style="margin: 0 0 20px; font-size: 16px;">Thank you for registering with MedEase! To complete your registration, please verify your email address by clicking the button below:</p>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color: #10B8B9; border-radius: 6px; text-align: center; padding: 15px;">
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



//forgot password
const passwordResetMail = async (email, token) => {
  const mailOptions = {
    from: `MedEase <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: 'Password Reset Request - MedEase',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - MedEase</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            color: #333333;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #10B8B9;
            padding: 20px 30px;
            text-align: center;
          }
          .header img {
            max-width: 180px;
            height: auto;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #10B8B9;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content p {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .button-wrapper {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            background-color: #10B8B9;
            color: #ffffff !important;
            text-shadow: 0 1px 1px rgba(0,0,0,0.2);
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
          }
          .footer {
            text-align: center;
            padding: 20px 30px;
            font-size: 12px;
            color: #999999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- Logo Header -->
         
          
          <!-- Main Content -->
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Dear User,</p>
            <p>We received a request to reset your password. To proceed, please click the button below. If you did not request a password reset, you can safely ignore this email.</p>
            
            <div class="button-wrapper">
              <a href="http://localhost:3000/reset-password?t=${token}" class="button">Reset Password</a>
            </div>
            
            <p>This link will expire in 5 minutes for your security.</p>
            <p>Thank you,<br>MedEase Team</p>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            © ${new Date().getFullYear()} MedEase. All rights reserved.
          </div>
          
        </div>
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
});
};


//notification
function sendAppointmentStatusEmail(email, doctorName,patientName, appointmentDate, appointmentime, status, note) {
  // Define the email options
  const mailOptions = {
    from: `MedEase <${process.env.NODE_MAILER_EMAIL}>`,
    to: email, ///patient
    subject: `Appointment ${status}`, // Subject based on the status
    text: `Dear ${patientName},\n\nDr. ${doctorName} has ${status} your appointment for ${appointmentDate} at ${appointmentime}. Doctor's note: ${note}. Hope to see you on time.\n\nBest regards,\nMedEase Team` // Body of the email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


module.exports = {verifyEmailMail, passwordResetMail, sendAppointmentStatusEmail};