import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './SideBar.css'

const AdminBar = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/login/admin');
    };

      useEffect(() => {
        const fetchAdmin = async () => {
          try {
            const res = await fetch('http://localhost:5000/auth/me-admin', {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const data = await res.json();
            setUsername(data.fullName);
          } catch (err) {
            console.error("Failed to fetch admin details", err);
          }}

          fetchAdmin();
        },[token]);

    const handleNavigate = (path) => navigate(path);
    return(

        <div className="admin-nav-container">
            <div className="admin-home-sidebar">
                <div className='logo-admin'>MedEase</div>
                <h2 className="admin-home-panel-title">Admin Panel</h2>
                <div className="admin-home-sidebar-menu">
                <div className="admin-home-menu-item active" onClick={() => handleNavigate('/admin/dashboard')}>Dashboard</div>
                <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/users')}>Users</div>
                <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/doctors')}>Doctors</div>
                <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/appointments')}>Appointments</div>
                <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/departments')}>Departments</div>
                </div>

                <span className="admin-home-welcome-text">Welcome, {username}</span>
                <button className="admin-home-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default AdminBar;