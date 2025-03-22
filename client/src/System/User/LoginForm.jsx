import React, { useState } from "react";
// import './LoginForm.css';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        navigate(data.user.role === "doctor" ? "/doctor-dashboard" : "/appointment-book");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  

  return (

    <div className="signup-container">
    <div className="left-pane">
      <h1>MedEase</h1>
      <p>A hospital Appointment Booking System</p>
    </div>
    <div className="right-pane">
      <h2>Login to your account</h2>
      <form onSubmit={handleSubmit}>
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
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
    </div>
  );
};

localStorage.clear();

export default LoginForm;
