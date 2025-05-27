import { useState } from 'react';
import './ChangePassword.css';
import NavBar from '../../Components/User/Navbar';
import Footer from '../../Components/User/Footer';
import Resources from '../../Components/User/Resources';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/auth/change-password', {
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

      toast.success('Password changed successfully!');
      setError(null);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message);
      setMessage(null);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Change the route to your profile page
  };

  return (
    <>
      <NavBar />
      <div className="password-wrapper">
        <h2 className="password-heading">Change Password</h2>

        {message && <p className="password-success">{message}</p>}
        {error && <p className="password-error">{error}</p>}

        <div className="password-input-group">
          <label className="password-label">Current Password</label>
          <input
            type="password"
            className="password-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="password-input-group">
          <label className="password-label">New Password</label>
          <input
            type="password"
            className="password-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="password-button-group">
          <button
            onClick={handleCancel}
            className="password-cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordChange}
            className="password-submit-button"
            disabled={!currentPassword || !newPassword}
          >
            Change Password
          </button>
        </div>
      </div>
      <Resources />
      <Footer />
    </>
  );
};

export default ChangePasswordPage;

