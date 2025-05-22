const dotenv = require("dotenv");
dotenv.config();
const fetch = require('node-fetch');

// Khalti Payment Initiation API (after appointment confirmation)
const khaltiPaymentInitiation = async (req, res) => {
  const {appointmentId} = req.body;
  // const amount = 500;

  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "No appointments provided." });
  }

  try {

    // Fetch appointment details including user info
    const appointment = await Appointment.findById(appointmentId)
    .populate('user')
    .populate({
      path: 'doctor',
      populate: { path: 'department' } // populate department inside doctor

    });
  
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    let amount = appointment.doctor.doctorfee * 100; // convert to paisa

    const payload = {
      return_url: "http://localhost:3000/khalti/payment/verify",  // Page where Khalti will redirect after payment
      website_url: "http://localhost:3000/khalti/payment/verify",
      amount: amount, // Convert to paisa (100 paisa = 1 NPR)
      purchase_order_id: `APPT-${appointmentId}`,
      purchase_order_name: "MedEase Appointment Payment",
    };

    console.log("Khalti payload:", payload);

    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: data.detail || "Khalti error during initiation",
        errorFromKhalti: data // log full response from Khalti
      });
    }


    //Store in DB (or update existing appointment)
    const newAppointment = await AppointmentPayment.create({
      appointment: appointmentId,
      paymentMethod: "khalti",
      paymentStatus: "pending",
      pidx: data.pidx,
      paymentUrl: data.payment_url,
    
      // Now store populated data:
      patientName: appointment.user.fullName,      
      doctorName: appointment.doctor.fullName,   
      amount: appointment.doctor.doctorfee,   
      department: appointment.doctor.department.name,    
      appointmentDate: appointment.date,
      appointmentTime: appointment.time,
    });

    await newAppointment.save();
  
    return res.status(200).json({
      success: true,
      message: "Khalti payment initiated",
      paymentUrl: data.payment_url,
      pidx: data.pidx
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};




const {Appointment} = require("../Schema/appointmentSchema");
const { AppointmentPayment } = require("../Schema/paymentSchema");

const verifyKhaltiPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({ success: false, message: "pidx is required" });
  }

  try {
    const verifyRes = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const result = await verifyRes.json();
    console.log("Khalti verification result:", result);

    if (result.status === "Completed") {
      const updatedPayment = await AppointmentPayment.findOneAndUpdate(
        { pidx },
        { paymentStatus: "completed" },
        { new: true }
      );

      if (!updatedPayment) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found for provided pidx.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and information posted successfully",
        appointment: {
          patientName: updatedPayment.patientName,
          doctorName: updatedPayment.doctorName,
          department: updatedPayment.department,
          appointmentDate: updatedPayment.appointmentDate,
          appointmentTime: updatedPayment.appointmentTime,
          amount: updatedPayment.amount,
          paymentStatus: updatedPayment.paymentStatus,
          paymentMethod: updatedPayment.paymentMethod
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
        KhaltiResponse: result
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:"Server error during payment verification",
      error: err.message
    });
  }
};

module.exports = {khaltiPaymentInitiation, verifyKhaltiPayment};
