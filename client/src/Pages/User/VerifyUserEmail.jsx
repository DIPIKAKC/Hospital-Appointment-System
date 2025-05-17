import React, { useEffect, useState } from 'react';
import NavBar from '../../Components/User/Navbar';
import Resources from '../../Components/User/Resources';
import Footer from '../../Components/User/Footer';
import './VerifyUserEmail.css'; 
import { useNavigate } from 'react-router-dom';

export const VerifyUserEmail = () => {
  const [successMessage, setSuccessMessage] = useState('Your email has been verified. You can now continue to login');
  const [status, setStatus] = useState('pending'); // pending, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('t');
    verifyEmail(token)

  }, []);

  const verifyEmail = async(token) => {
    try{

      const res = await fetch(`http://localhost:5000/auth/verify-email/${token}`,{
        method : "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()

      if(data.success) {
        setStatus("success")
      }
      else {
        setStatus("error")
      }

    }catch(error){
      alert(error.message)
    }

  }

  return (
    <>
      <NavBar />
        <div className="verification-card">
          <h2 className="verification-title">Email Verification</h2>
          {successMessage && (
          <div
            style={{
              backgroundColor: "#d1fae5", // light green background
              color: "#047857",          // dark green text
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            {successMessage}
          </div>
        )}
          <a href="/login" className="verification-button" onClick={()=>navigate('/login')}>Continue to Login</a>
        </div>

      <Resources />
      <Footer />
    </>
  );
};
