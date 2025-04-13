import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // updated CSS import

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
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/admin/stats', {
          method: "GET",
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
    <div className="admin-home-container">
      <div className="admin-home-sidebar">
        <h2 className="admin-home-panel-title">Admin Panel</h2>
        <div className="admin-home-sidebar-menu">
          <div className="admin-home-menu-item active" onClick={() => handleNavigate('/admin/dashboard')}>Dashboard</div>
          <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/users')}>Users</div>
          <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/doctors')}>Doctors</div>
          <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/appointments')}>Appointments</div>
          <div className="admin-home-menu-item" onClick={() => handleNavigate('/admin/departments')}>Departments</div>
        </div>
      </div>

      <div className="admin-home-main-content">
        <header className="admin-home-header">
          <h1 className="admin-home-dashboard-title">Admin Dashboard</h1>
          <div className="admin-home-user-actions">
            <span className="admin-home-welcome-text">Welcome, {username}</span>
            <button className="admin-home-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="admin-home-dashboard-content">
          <div className="admin-home-stats-container">
            <div className="admin-home-stat-card blue">
              <h3>Total Users</h3>
              <p className="admin-home-stat-value">{stats.users}</p>
              <a className="admin-home-view-link" onClick={() => handleNavigate('/admin/users')}>View All Users →</a>
            </div>

            <div className="admin-home-stat-card green">
              <h3>Total Doctors</h3>
              <p className="admin-home-stat-value">{stats.doctors}</p>
              <a className="admin-home-view-link" onClick={() => handleNavigate('/admin/doctors')}>View All Doctors →</a>
            </div>

            <div className="admin-home-stat-card purple">
              <h3>Total Appointments</h3>
              <p className="admin-home-stat-value">{stats.appointments}</p>
              <a className="admin-home-view-link" onClick={() => handleNavigate('/admin/appointments')}>View All Appointments →</a>
            </div>
          </div>

          <div className="admin-home-quick-actions">
            <h3>Quick Actions</h3>
            <div className="admin-home-action-buttons">
              <button className="admin-home-action-btn add-doctor" onClick={handleAddDoctor}>Add New Doctor</button>
              <button className="admin-home-action-btn add-doctor" onClick={handleAddDepartment}>Add New Department</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
