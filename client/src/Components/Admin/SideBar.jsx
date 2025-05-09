import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './SideBar.css'

const AdminBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    const currentPath = location.pathname;


    return(
        <div className="admin-nav-container">
            <div className="admin-home-sidebar">
                <div className='logo-admin'>MedEase</div>
                <h2 className="admin-home-panel-title">Admin Panel</h2>
                <div className="admin-home-sidebar-menu">
                  <div className={`admin-home-menu-item ${currentPath === '/admin/dashboard' ? 'active' : ''}`} onClick={() => handleNavigate('/admin/dashboard')}>Dashboard</div>
                  <div className={`admin-home-menu-item ${currentPath === '/admin/users' ? 'active' : ''}`} onClick={() => handleNavigate('/admin/users')}>Users</div>
                  <div className={`admin-home-menu-item ${currentPath === '/admin/doctors' ? 'active' : ''}`} onClick={() => handleNavigate('/admin/doctors')}>Doctors</div>
                  <div className={`admin-home-menu-item ${currentPath === '/admin/appointments' ? 'active' : ''}`} onClick={() => handleNavigate('/admin/appointments')}>Appointments</div>
                  <div className={`admin-home-menu-item ${currentPath === '/admin/departments' ? 'active' : ''}`} onClick={() => handleNavigate('/admin/departments')}>Departments</div>
                  <div className={`admin-home-menu-item ${currentPath === '/admin/resources' ? 'active' : ''}`} onClick={() => handleNavigate('/admin/resources')}>Resources</div>
                </div>

                <span className="admin-home-welcome-text">Welcome, {username}</span>
                <button className="admin-home-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default AdminBar;