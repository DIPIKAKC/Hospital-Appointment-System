import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import './KhaltiSuccess.css';
import { IoCheckmark } from "react-icons/io5";
import NavBar from '../../Components/User/Navbar';
import Footer from '../../Components/User/Footer';
import Resources from '../../Components/User/Resources';

const PaymentSuccess = () => {
  const location = useLocation();
  
  // If no state or appointment details were passed, redirect to home
  if (!location.state || !location.state.appointmentDetails) {
    return <Navigate to="/" />;
  }
  
  const { appointmentDetails } = location.state;
  
  return (
    <>
    <NavBar/>
    <div className="payment-success-container">
      <div className="success-header">
        <h2>Payment Successful!</h2>
        <div className="checkmark-circle">
          <i className="checkmark"><IoCheckmark size={60}/></i>
        </div>
      </div>
      
      <div className="payment-info">
        <p><strong>Amount Paid:</strong> {appointmentDetails.amount} NPR</p>
        <p><strong>Payment Status:</strong> {appointmentDetails.paymentStatus}</p>
        <p><strong>Payment Method:</strong> {appointmentDetails.paymentMethod}</p>
      </div>
      
      <div className="appointment-details">
        <h3>Appointment Details</h3>
        <table>
          <tbody>
            <tr>
              <td>Patient Name:</td>
              <td>{appointmentDetails.patientName}</td>
            </tr>
            <tr>
              <td>Doctor:</td>
              <td>{appointmentDetails.doctorName}</td>
            </tr>
            <tr>
              <td>Department:</td>
              <td>{appointmentDetails.department}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>{appointmentDetails.appointmentDate}</td>
            </tr>
            <tr>
              <td>Time:</td>
              <td>{appointmentDetails.appointmentTime}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="action-buttons">
        {/* <button 
          className="print-button"
          onClick={() => window.print()}
        >
          Print Receipt
        </button> */}
        <button 
          className="home-button"
          onClick={() => window.location.href = '/appointments'}
        >
          Back to Appointments
        </button>
      </div>
    </div>
    <Resources />
    <Footer />
    </>
  );
};

export default PaymentSuccess;