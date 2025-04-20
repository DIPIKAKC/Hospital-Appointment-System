import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import NavBar from '../../Components/User/Navbar';
import Resources from '../../Components/User/Resources';
import Footer from '../../Components/User/Footer';
import { BsPerson } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";


const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me-user", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [token]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="not-found-container">
        <p>Patient not found</p>
      </div>
    );
  }

  return (
    <>
    <NavBar /> 

    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            {/* {patient.role || 'no role'} */}
          </div>
          <div className="profile-text">
            <h1 className="profile-name">
              {patient.fullName}
            </h1>
            <p className="patient-id">ID: {patient.id || 'no id'}</p>
          </div>
        </div>
        <button className="edit-button">Edit Profile</button>
      </div>

      {/* Info Cards */}
      <div className="info-grid">
        {/* Personal Information Card */}
        <div className="info-card">
          <h2 className="card-title">
            <span className="icon"><BsPerson /></span>
            Personal Information
          </h2>
          <div className="info-item">
            <label className="info-label">Date of Birth</label>
            <p className="info-value">{formatDate(patient.dateOfBirth) || 'no dob'}</p>
          </div>
          <div className="info-item">
            <label className="info-label">Gender</label>
            <p className="info-value">{patient.gender || 'no g'}</p>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="info-card">
          <h2 className="card-title">
            <span className="icon"><IoCallOutline /></span>
            Contact Information
          </h2>
          <div className="info-item">
            <label className="info-label">Phone</label>
            <p className="info-value">{patient.contactInfo || 'not available'}</p>
          </div>
          <div className="info-item">
            <label className="info-label">Email</label>
            <p className="info-value">{patient.email || 'no email'}</p>
          </div>
          <div className="info-item">
            <label className="info-label">Address</label>
            <p className="info-value">
              {patient.address || 'no address'}
            </p>
          </div>
        </div>

        {/* Emergency Contact Card */}
        {/* <div className="info-card">
          <h2 className="card-title">
            <span className="icon">🚨</span>
            Emergency Contact
          </h2>
          <div className="info-item">
            <label className="info-label">Name</label>
            <p className="info-value">{patient.contactInfo.emergencyContact.name}</p>
          </div>
          <div className="info-item">
            <label className="info-label">Relationship</label>
            <p className="info-value">{patient.contactInfo.emergencyContact.relationship}</p>
          </div>
          <div className="info-item">
            <label className="info-label">Phone</label>
            <p className="info-value">{patient.contactInfo.emergencyContact.phone}</p>
          </div>
        </div> */}
      </div>
    </div>

      <Resources />
      <Footer />
    </>
  );
};

export default PatientProfile;