
import { toast } from "sonner";
import React, { useEffect } from "react";

const InitiatingKhaltiPayment = ({ appointment}) => {
  // Effect hook to handle payment redirection once the component is rendered
  useEffect(() => {
    const handleKhaltiPayment = async () => {
      const user = JSON.parse(localStorage.getItem("userData"));

      console.log("Appointment: ", appointment);

      if (!appointment || !user) {
        toast.error("Invalid appointment or user info.");
        return;
      }

      const payload = {
        purchaseOrderId: `ORDER-${Date.now()}`,
        appointmentId: appointment._id,
        userId: appointment.user._id,
        doctorId: appointment.doctor._id,
        department: appointment.doctor.department.name,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        reason: appointment.reason,
      };


      try {

        const res = await fetch("http://localhost:5000/auth/payment/khalti/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("Khalti response: ",data)
        
        if (data.success) {
          toast.success("Redirecting to Khalti...");
          window.location.href = data.paymentUrl;
        } else {
          toast.error(data.message || "Payment initiation failed.");
        }
      } catch (error) {
        console.error("Khalti Payment Error:", error);
        toast.error("Failed to initiate Khalti payment.");
      }
    };

    handleKhaltiPayment();
  }, [appointment]);

  return null; // This component just handles the redirect, so no UI needed
};

export default InitiatingKhaltiPayment;
