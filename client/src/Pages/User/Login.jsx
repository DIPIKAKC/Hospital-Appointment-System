import React, { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { toast } from "sonner";

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
        localStorage.setItem("user", JSON.stringify(data.user.fullName));
        localStorage.setItem("id", data.user.userId);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userData", JSON.stringify(data.user));

        toast.success("Login successful!");

        setTimeout(() => {
          if (data.user.role === 'doctor') {
            navigate("/doc-dashboard"); 
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (

      <div className="auth-container">
      <div className="content">
        <div className="seperate">
          <h1>MedEase</h1>
          <X onClick={() => navigate('/')}/>
        </div>
        <p>A hospital Appointment Booking System</p>
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
          <a href= '/forgot-password' className="forgot-pw">Forgot password?</a>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
      </div>
    );
};

export default LoginForm;
