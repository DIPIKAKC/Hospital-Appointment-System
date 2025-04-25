const dotenv = require("dotenv");
dotenv.config();

const fetch = require('node-fetch');

// Khalti Payment Initiation API (after appointment confirmation)
const khaltiPaymentInitiation = async (req, res) => {
  const { id, name, amount, appointmentId} = req.body;
  console.log("Khalti payload:", req.body)

  // Parse amount to integer (Khalti requires amount in paisa)
  const getAmount = amount || '100'; // assuming amount is in NPR
  const validAmount = parseInt(getAmount); // Must be string for API

  try {
    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        return_url: "http://localhost:3000/payment-status", // Page where Khalti will redirect after payment
        website_url: "http://localhost:3000/",
        amount: validAmount,
        purchase_order_id: id,
        purchase_order_name: name,
        appointmentId: appointmentId
        // ,
        // customer_info: {
        //   name: name,
        //   email: "testuser@email.com", // optional
        //   phone: "9800000000" // optional
        // }
      })
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: "Payment URL generated successfully",
        payment_url: data.payment_url
      });
    } else {
      const error = await response.text();
      return res.status(500).json({
        success: false,
        message: "Khalti API error",
        error: error
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};




const {Appointment} = require("../Schema/appointmentSchema")

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

    if (result.status === "Completed") {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        { pidx },
        { paymentStatus: "paid" },
        { new: true }
      );

      if (!updatedAppointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found for the provided pidx",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and information posted successfully",
        appointment: updatedAppointment,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error during payment verification",
    });
  }
};

module.exports = {khaltiPaymentInitiation, verifyKhaltiPayment};
