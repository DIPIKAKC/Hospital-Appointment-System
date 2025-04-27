import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentStatus = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation()

useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pidx = params.get('pidx');
  
        if (!pidx) {
          setError('Invalid payment information');
          setLoading(false);
          return;
        }
  
        const response = await fetch("http://localhost:5000/auth/payment/khalti/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ pidx })
        });
  
        const data = await response.json();
  
        if (data.success) {
          setPaymentDetails(data.appointment); // store appointment details
        } else {
          setError(data.message || 'Payment verification failed');
        }
      } catch (error) {
        setError('An error occurred during payment verification');
      } finally {
        setLoading(false);
      }
    };
  
    verifyPayment();
  }, [location]);


  if (loading) {
    return <div>Verifying payment, please wait...</div>;
  }

  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Amount Paid: {paymentDetails.amount / 100} NPR</p>
      <p>Payment Status: {paymentDetails.paymentStatus}</p>
      <div className='appointment-details'>
        <h3> Appointment Details: </h3>
        <p>{paymentDetails.patientName}</p>
        <p>{paymentDetails.doctorName}</p>
        <p>{paymentDetails.department}</p>
        <p>{paymentDetails.appointmentDate}</p>        
        <p>{paymentDetails.appointmentTime}</p>
      </div>
      <p>Payment Method: {paymentDetails.paymentMethod}</p>
    </div>
  );
};


export default PaymentStatus;