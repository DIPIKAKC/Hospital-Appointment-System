import React, { useState, useEffect } from 'react';
import './DocProfile.css';
import { BsPerson } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import DocBar from '../../Components/Doctor/DoctorNavbar';
import FooterDoc from '../../Components/Doctor/FooterDoctor';

const DoctorProfile = () => {
  const [doctor, setdoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactInfo: "",
    department: "",
    experience: "",
    gender: ""
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch doctor data');

        const data = await response.json();
        setdoctor(data);
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          contactInfo: data.contactInfo || "",
          department: data.department || "",
          experience: data.experience || "",
          gender: data.gender || ""
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctorData();
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

  //edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== doctor[key]) {
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
          <p>Loading doctor data...</p>
        </div>
      );
    }

    try {
      const response = await fetch("http://localhost:5000/auth/edit-doc", {
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
        setdoctor((prev) => ({ ...prev, ...updatedData }));
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

  if (!doctor) {
    return (
      <div className="profile-notfound">
        <p>doctor not found</p>
      </div>
    );
  }

  return (
    <>

    <DocBar />
      <div className="doctor-profile">
        <div className="doctor-profile__header">
          <div className="doctor-profile__header-content">
            <div className="doctor-profile__avatar"></div>
            <div className="doctor-profile__info">
              <h1 className="doctor-profile__name">{doctor.fullName}</h1>
              <p className="doctor-profile__id">ID: {doctor.id || 'no id'}</p>
            </div>
          </div>
          <button className="doctor-profile__edit-btn" onClick={() => setModalOpen(true)}>
            Edit Profile
          </button>
        </div>

        <div className="doctor-profile__grid">
          <div className="doctor-profile__card">
            <h2 className="doctor-profile__card-title">
              <span className="doctor-profile__icon"><BsPerson /></span>
              Personal Information
            </h2>
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Date of Birth</label>
              <p className="doctor-profile__value">{formatDate(doctor.dateOfBirth) || 'no dob'}</p>
            </div>
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Gender</label>
              <p className="doctor-profile__value">{doctor.gender || 'no g'}</p>
            </div>
          </div>

          <div className="doctor-profile__card">
            <h2 className="doctor-profile__card-title">
              <span className="doctor-profile__icon"><IoCallOutline /></span>
              Contact Information
            </h2>
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Phone</label>
              <p className="doctor-profile__value">{doctor.contactInfo || 'not available'}</p>
            </div>
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Email</label>
              <p className="doctor-profile__value">{doctor.email || 'no email'}</p>
            </div>
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Address</label>
              <p className="doctor-profile__value">{doctor.address || 'no address'}</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="doctor-modal-overlay">
          <div className="doctor-modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />

              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />

              <label>Contact Info</label>
              <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />

              {/* <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />

              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} /> */}
{/* 
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select> */}

              <div className="doctor-modal-buttons">
                <button type="submit" className="doctor-modal-save">Save</button>
                <button type="button" className="doctor-modal-close" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FooterDoc />
    </>
  );
};

export default DoctorProfile;
