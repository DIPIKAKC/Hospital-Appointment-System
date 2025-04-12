import React, { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
     email: "",
     password: "" ,
  });

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
      if (response.ok) {
        alert("Account created successfully");
        setTimeout(()=>{
            navigate('/');
        },1000);
            
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (

    <div className="auth-container">
    <div className="content">
      <h1>MedEase</h1>
      <p>A hospital Appointment Booking System</p>
      <h2>Login to your account</h2>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
    </div>
  );
};

export default SignupForm;
