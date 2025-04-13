import React, { useState } from "react";
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';


const SignupAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName:"",
     email: "",
     password: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debugging
  
    try {
      const response = await fetch("http://localhost:5000/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user.fullName));
        localStorage.setItem("id", data.user.userId); //This stores the user ID
        alert("Login successful!");
        navigate("/login/admin");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  

  return (

    <div className="auth-container">
    <div className="content">
      <h1>MedEase</h1>
      <p>A hospital Appointment Booking System</p>
      <h2>Admin Sign up</h2>
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
        Already have an account? <a href="/login/admin">Login</a>
      </p>
    </div>
    </div>
  );
};

export default SignupAdmin;
