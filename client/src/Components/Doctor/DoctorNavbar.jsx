import React, { useState } from 'react';
import './DoctorNavbar.css';

const DoctorNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>MedPortal</h1>
      </div>
      
      <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      
      <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
        <li className="navbar-item">
          <a href="/dashboard" className="navbar-link">
            <i className="icon icon-home"></i>
            Home
          </a>
        </li>
        <li className="navbar-item">
          <a href="/appointments" className="navbar-link">
            <i className="icon icon-calendar-check"></i>
            My Appointments
          </a>
        </li>
        <li className="navbar-item">
          <a href="/schedule" className="navbar-link">
            <i className="icon icon-clock"></i>
            My Schedule
          </a>
        </li>
        <li className="navbar-item">
          <a href="/patients" className="navbar-link">
            <i className="icon icon-users"></i>
            My Patients
          </a>
        </li>
        <li className="navbar-item">
          <a href="/lab-results" className="navbar-link">
            <i className="icon icon-flask"></i>
            Lab Results
          </a>
        </li>
        <li className="navbar-item">
          <a href="/messages" className="navbar-link">
            <i className="icon icon-envelope"></i>
            Messages
          </a>
        </li>
      </ul>
      
      <div className="navbar-profile">
        <div className="profile-image">
          <img src="/assets/doctor-avatar.png" alt="Doctor" />
        </div>
        <div className="profile-dropdown">
          <span>Dr. Sarah Johnson</span>
          <i className="icon icon-chevron-down"></i>
          <div className="dropdown-content">
            <a href="/profile">My Profile</a>
            <a href="/settings">Settings</a>
            <a href="/logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;