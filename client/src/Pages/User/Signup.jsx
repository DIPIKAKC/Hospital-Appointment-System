import React, { useState, useEffect } from "react";
import './Login.css';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const SignupForm = ({ onClose }) => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
     email: "",
     password: "" ,
  });
  const [successMessage, setSuccessMessage] =useState();
  const[errorMessage,setErrorMessage] =useState()
  const navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        // alert("Account created successfully");
        setSuccessMessage('please check your email to verify account')
        
            
      } else {
        setErrorMessage(data.message || 'error ')

      }
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 5000)
  }, [setSuccessMessage])

  return (

    <div className="auth-container">
    <div className="content">
        <div className="seperate">
          <h1>MedEase</h1>
          <X onClick={() => navigate('/')}/>
        </div>
      <p>A hospital Appointment Booking System</p>
      <h2>Create a new account</h2>

      <div>
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
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#fee2e2", // light red background
              color: "#b91c1c",          // dark red text
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Create account</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
    </div>
  );
};

export default SignupForm;
