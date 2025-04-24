// import { toast } from "sonner";
// import React from "react";

// const InitiatingKhaltiPayment = ({ appointmentId, doctorId, amount, appointments }) => {

  
//   const handleKhaltiPayment = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const userId = user._id;

//     try {
//     //   const appointmentPayload = {
//     //     purchaseOrderId: `ORD-${Date.now()}`,
//     //     userId,
//     //     appointmentId,
//     //     doctorId,
//     //     totalAmount: amount * 100, // in paisa
//     //     paymentMethod: "khalti",
//     //     userEmail: user.email,
//     //     appointments: appointments.map((appointment) => ({
//     //       appointmentId: appointment._id,
//     //       doctorId: appointment.doctorId,
//     //       doctorName: appointment.doctor.fullName,
//     //       department: appointment.doctor.department.name,
//     //       date: appointment.date,
//     //       time: appointment.time,
//     //       status: appointment.status || " ",
//     //       price: appointment.price,
//     //     })),
//     //   };
//     const payload = {
//         id: `ORD-${Date.now()}`,
//         name: "MedEase Appointment",
//         amount : amount // convert to paisa
//       };

//       const res = await fetch("http://localhost:5000/auth/payment/khalti/initiate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.success) {
//         toast.success("Redirecting to Khalti...");
//         window.location.href = data.paymentUrl;
//       } else {
//         toast.error("Payment initiation failed.");
//       }
//     } catch (error) {
//       console.error("Khalti Payment Error:", error);
//       toast.error("Failed to initiate Khalti payment.");
//     }
//   };

// };

// export default InitiatingKhaltiPayment;


import { toast } from "sonner";
import React, { useEffect } from "react";

const InitiatingKhaltiPayment = ({ appointmentId, doctorId, amount, appointments }) => {
  // Effect hook to handle payment redirection once the component is rendered
  useEffect(() => {
    const handleKhaltiPayment = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;

      try {
        const payload = {
          id: `ORD-${Date.now()}`,
          name: "MedEase Appointment",
          amount: amount * 100, // Convert to paisa
        };

        const res = await fetch("http://localhost:5000/auth/payment/khalti/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          // Redirecting the user to the Khalti payment URL
          toast.success("Redirecting to Khalti...");
          window.location.href = data.payment_url;
        } else {
          toast.error("Payment initiation failed.");
        }
      } catch (error) {
        console.error("Khalti Payment Error:", error);
        toast.error("Failed to initiate Khalti payment.");
      }
    };

    handleKhaltiPayment();
  }, [appointmentId, doctorId, amount, appointments]);

  return null; // This component just handles the redirect, so no UI needed
};

export default InitiatingKhaltiPayment;
