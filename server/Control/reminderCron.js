const mongoose = require('mongoose');
const cron = require('node-cron');
const { Reminder } = require('../Schema/reminderSchema');
const { reminderEmail } = require('./reminderEmail');

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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder - MedEase</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 20px 0;">
              <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; margin: 0 auto;">
                
                <!-- Header -->
                <tr>
                    <td style="background-color: #10B8B9; text-align: center; padding: 20px;">
                       <h2 style= "width="180" style="text-align: center; display: block; margin: 0 auto; color: #ffffff">MedEase</h2>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #10B8B9; font-size: 24px;">Appointment Reminder</h2>
                      <p style="margin: 0 0 20px;"font-size: 18px;">Dear ${reminder.patientName},</p>
                      <p style="margin: 0 0 20px;"font-size: 18px;">This is a gentle reminder for your upcoming appointment.</p>
                      <p style="margin: 0 0 20px;"font-size: 18px;"><strong>Dr. </strong> ${reminder.doctorName}</p>
                      <p style="margin: 0 0 20px;"font-size: 18px;"><strong>Dpeartment:</strong> ${reminder.department}</p>
                      <p style="margin: 0 0 20px;"font-size: 18px;"><strong>Date:</strong> ${reminder.date}</p>
                      <p style="margin: 0 0 20px;"font-size: 18px;"><strong>Time:</strong> ${reminder.time}</p>
                      <p style="margin: 0 0 30px;"font-size: 14px; color: #888;">Please be on time. If you have any questions, contact us via the MedEase portal.</p>
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
