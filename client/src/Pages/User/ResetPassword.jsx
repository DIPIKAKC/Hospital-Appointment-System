import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/User/Navbar';
import Resources from '../../Components/User/Resources';
import Footer from '../../Components/User/Footer';
import './ResetPassword.css'; // import the CSS file

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const token = params.get('t');
    if (token) setToken(token);
  }, [params]);

  useEffect(() => {
    if (error || success) {
      setTimeout(() => {
        setError('');
        setSuccess('');
      }, 4000);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return setError('Please fill all the fields');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/auth/password-reset/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message || 'Password changed successfully');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Something went wrong, Try again!');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="reset-container">
        <div className="reset-card">
          <h1 className="reset-title">Reset Password</h1>
          <p className="reset-subtitle">Enter your new password below to reset your account.</p>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form className="reset-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="reset-label">New Password</label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="reset-input"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="reset-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="reset-input"
              />
            </div>
            <button type="submit" className="reset-button">
              {loading ? 'Changing password...' : 'Reset Password'}
            </button>
          </form>

          <div className="reset-login-link">
            <a href="/login">Back to Login</a>
          </div>
        </div>
      </div>
      <Resources />
      <Footer />
    </>
  );
};
