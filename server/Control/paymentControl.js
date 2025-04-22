const dotenv = require("dotenv");
dotenv.config();

const fetch = require('node-fetch');

// Khalti Payment Initiation API (after appointment confirmation)
const khaltiPayment = async (req, res) => {
  const { id, name, amount, appointmentId } = req.body;

  // Parse amount to integer (Khalti requires amount in paisa)
  const getAmount = parseInt(amount); // assuming amount is in NPR
  const resultedAmount = (12 * getAmount) / 100; // Your custom logic?
  const validAmount = String(resultedAmount); // Must be string for API

  try {
    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        return_url: "http://localhost:3000/payment-status", // Page where Khalti will redirect after payment
        website_url: "http://localhost:3000",
        amount: validAmount,
        purchase_order_id: id,
        purchase_order_name: name
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
module.exports = khaltiPayment;
