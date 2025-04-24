const handleKhaltiPayment = async (appointmentId, doctorId, amount) => {
    try {
      const appointmentPayload = {
        purchaseOrderId: `ORD-${Date.now()}`,
        userId: userId,
        appointmentId: appointmentId,          // ID of the confirmed appointment
        doctorId: doctorId,     
        totalAmount: amount * 100, // paisa
        paymentMethod: 'khalti',
        userEmail: user.email,
        appointments: appointments.map((appointment) => ({
            appointmentId: appointment._id,
            doctorId: appointment.doctorId,
            doctorName: appointment.doctor.fullName,
            department: appointment.doctor.department.name,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status || ' ',
            price: appointment.price
        })),
      };

      const res = await fetch("http://localhost:5000/auth/payment/khalti/initiate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentPayload),
      });
  
      const data = await res.json();
  
      if (data.success) {
        toast.success("Redirecting to Khalti...");
        window.location.href = data.paymentUrl;  // Redirect to Khalti gateway
      } else {
        toast.error("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Khalti Payment Error:", error);
      toast.error("Failed to initiate Khalti payment.");
    }
  };