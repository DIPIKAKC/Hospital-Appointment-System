import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch admin info
    const fetchAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/me-admin', {
          method : "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setUsername(data.fullName);
      } catch (err) {
        console.error("Failed to fetch admin details", err);
      }
    };

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/admin/stats', {
          method : "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setStats({
          users: data?.users || 0,
          doctors: data?.doctors || 0,
          appointments: data?.appointments || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchAdmin();
    fetchStats();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login/admin');
  };

  const handleNavigate = (path) => navigate(path);
  const handleAddDoctor = () => navigate('/admin/add-doctor');
  const handleAddDepartment = () => navigate('/admin/add-department');

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="panel-title">Admin Panel</h2>
        <div className="sidebar-menu">
          <div className="menu-item active" onClick={() => handleNavigate('/admin/dashboard')}>Dashboard</div>
          <div className="menu-item" onClick={() => handleNavigate('/admin/users')}>Users</div>
          <div className="menu-item" onClick={() => handleNavigate('/admin/doctors')}>Doctors</div>
          <div className="menu-item" onClick={() => handleNavigate('/admin/appointments')}>Appointments</div>
          <div className="menu-item" onClick={() => handleNavigate('/admin/departments')}>Departments</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="user-actions">
            <span className="welcome-text">Welcome, {username}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="stats-container">
            <div className="stat-card blue">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.users}</p>
              <a className="view-link" onClick={() => handleNavigate('/admin/users')}>View All Users →</a>
            </div>

            <div className="stat-card green">
              <h3>Total Doctors</h3>
              <p className="stat-value">{stats.doctors}</p>
              <a className="view-link" onClick={() => handleNavigate('/admin/doctors')}>View All Doctors →</a>
            </div>

            <div className="stat-card purple">
              <h3>Total Appointments</h3>
              <p className="stat-value">{stats.appointments}</p>
              <a className="view-link" onClick={() => handleNavigate('/admin/appointments')}>View All Appointments →</a>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn add-doctor" onClick={handleAddDoctor}>Add New Doctor</button>
              <button className="action-btn add-doctor" onClick={handleAddDepartment}>Add New Department</button>
              {/* <button className="action-btn add-user">Add New User</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
