import { useState } from 'react';
import './ChangeDocPw.css';
import { useNavigate } from 'react-router-dom';
import DocBar from '../../Components/Doctor/DoctorNavbar';
import FooterDoc from '../../Components/Doctor/FooterDoctor';

const ChangePasswordDoc = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/auth/change-pw-doc', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setError(null);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  const handleCancel = () => {
    navigate('/profile-doc'); 
  };

  return (
    <>
      <DocBar />
      <div className="doctor-password-wrapper">
        <h2 className="doctor-password-heading">Change Password</h2>

        {message && <p className="doctor-password-success">{message}</p>}
        {error && <p className="doctor-password-error">{error}</p>}

        <div className="doctor-password-input-group">
          <label className="doctor-password-label">Current Password</label>
          <input
            type="password"
            className="doctor-password-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="doctor-password-input-group">
          <label className="doctor-password-label">New Password</label>
          <input
            type="password"
            className="doctor-password-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder=" "
          />
        </div>

        <div className="doctor-password-button-group">
          <button
            onClick={handleCancel}
            className="doctor-password-cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordChange}
            className="doctor-password-submit-button"
            disabled={!currentPassword || !newPassword}
          >
            Change Password
          </button>
        </div>
      </div>
      <FooterDoc />
    </>
  );
};

export default ChangePasswordDoc;
