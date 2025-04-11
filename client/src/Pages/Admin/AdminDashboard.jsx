import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {

  const navigate = useNavigate();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.name || "admin";
  
  // Function to handle navigation to Add Doctor form
  const handleAddDoctor = () => {
    navigate('/admin/add-doctor');
  };
  
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login/admin');
  };
  
  // Function to handle navigation to different sections
  const handleNavigate = (path) => {
    navigate(path);
  };


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="panel-title">Admin Panel</h2>
        <div className="sidebar-menu">
          <div 
            className="menu-item active" 
            onClick={() => handleNavigate('/admin/dashboard')}
          >
            Dashboard
          </div>
          <div 
            className="menu-item" 
            onClick={() => handleNavigate('/admin/users')}
          >
            Users
          </div>
          <div 
            className="menu-item" 
            onClick={() => handleNavigate('/admin/doctors')}
          >
            Doctors
          </div>
          <div 
            className="menu-item" 
            onClick={() => handleNavigate('/admin/appointments')}
          >
            Appointments
          </div>
          </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="user-actions">
            <span className="welcome-text">Welcome, {username}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-container">
            <div className="stat-card blue">
              <h3>Total Users</h3>
              <p className="stat-value">--</p>
              <a className="view-link" onClick={() => handleNavigate('/admin/users')}>View All Users →</a>
            </div>
            
            <div className="stat-card green">
              <h3>Total Doctors</h3>
              <p className="stat-value">--</p>
              <a className="view-link" onClick={() => handleNavigate('/admin/doctors')}>View All Doctors →</a>
            </div>
            
            <div className="stat-card purple">
              <h3>Total Appointments</h3>
              <p className="stat-value">--</p>
              <a className="view-link" onClick={() => handleNavigate('/admin/appointments')}>View All Appointments →</a>
            </div>    
          </div>
          
          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn add-doctor" onClick={handleAddDoctor}>Add New Doctor</button>
              <button className="action-btn add-user" >Add New User</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;