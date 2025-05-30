import React, { useEffect, useState } from 'react';
import NavBar from '../../Components/User/Navbar';
import Resources from '../../Components/User/Resources';
import Footer from '../../Components/User/Footer';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; 

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/forgot-password', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message || "Email sent successfully, please check your inbox.");
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error in forgot-password:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error || success) {
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 4000);
    }
  }, [error, success]);

  return (
    <>
      <NavBar />
      <div className="forgot-container">
        <div className="forgot-box">
          <h1 className="forgot-title">Forgot Password</h1>
          <p className="forgot-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && <p className="forgot-error">{error}</p>}
          {success && <p className="forgot-success">{success}</p>}

          <form className="forgot-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="forgot-label">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="forgot-input"
              />
            </div>
            <button className="forgot-button" type="submit">
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="forgot-login-link">
            <a href="/login">Back to Login</a>
          </div>
        </div>
      </div>
      <Resources />
      <Footer />
    </>
  );
};
