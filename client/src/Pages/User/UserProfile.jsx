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
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactInfo: "",
    address: "",
    dateOfBirth: "",
    gender: ""
  });
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

        if (!response.ok) throw new Error('Failed to fetch patient data');

        const data = await response.json();
        setPatient(data);
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          contactInfo: data.contactInfo || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          gender: data.gender || ""
        });
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
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== patient[key]) {
        updatedData[key] = formData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      alert("No changes detected.");
      return;
    }
    if (loading) {
      return (
        <div className="profile-loading">
          <div className="profile-loading__spinner"></div>
          <p>Loading patient data...</p>
        </div>
      );
    }
    const userId = localStorage.getItem("id")
    try {
      const response = await fetch(`http://localhost:5000/auth/edit-user-by-id/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();
      if (result.success) {
        alert("Profile updated successfully!");
        setPatient((prev) => ({ ...prev, ...updatedData }));
        setModalOpen(false);

      } else {
        alert(result.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong.");
    }
  };

  if (error) {
    return (
      <div className="profile-error">
        <p className="profile-error__message">Error: {error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="profile-notfound">
        <p>Patient not found</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="user-profile">
        <div className="user-profile__header">
          <div className="user-profile__header-content">
            <div className="user-profile__avatar"></div>
            <div className="user-profile__info">
              <h1 className="user-profile__name">{patient.fullName}</h1>
              <p className="user-profile__id">ID: {patient.id || 'no id'}</p>
            </div>
          </div>
          <button className="user-profile__edit-btn" onClick={() => setModalOpen(true)}>
            Edit Profile
          </button>
        </div>

        <div className="user-profile__grid">
          <div className="user-profile__card">
            <h2 className="user-profile__card-title">
              <span className="user-profile__icon"><BsPerson /></span>
              Personal Information
            </h2>
            <div className="user-profile__item">
              <label className="user-profile__label">Date of Birth</label>
              <p className="user-profile__value">{formatDate(patient.dateOfBirth) || 'no dob'}</p>
            </div>
            <div className="user-profile__item">
              <label className="user-profile__label">Gender</label>
              <p className="user-profile__value">{patient.gender || 'no g'}</p>
            </div>
          </div>

          <div className="user-profile__card">
            <h2 className="user-profile__card-title">
              <span className="user-profile__icon"><IoCallOutline /></span>
              Contact Information
            </h2>
            <div className="user-profile__item">
              <label className="user-profile__label">Phone</label>
              <p className="user-profile__value">{patient.contactInfo || 'not available'}</p>
            </div>
            <div className="user-profile__item">
              <label className="user-profile__label">Email</label>
              <p className="user-profile__value">{patient.email || 'no email'}</p>
            </div>
            <div className="user-profile__item">
              <label className="user-profile__label">Address</label>
              <p className="user-profile__value">{patient.address || 'no address'}</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />

              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />

              <label>Contact Info</label>
              <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />

              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />

              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div className="modal-buttons">
                <button type="submit" className="modal-save">Save</button>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Resources />
      <Footer />
    </>
  );
};

export default PatientProfile;
