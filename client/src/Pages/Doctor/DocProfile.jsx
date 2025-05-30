import React, { useState, useEffect } from 'react';
import './DocProfile.css';
import { BsPerson } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import DocBar from '../../Components/Doctor/DoctorNavbar';
import FooterDoc from '../../Components/Doctor/FooterDoctor';
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'sonner';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    department:"",
    email: "",
    contact: "",     
    dateOfBirth: "",
    experience:"",
    gender: "",
    address:"",
    image: null
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
        console.log(data);
        setDoctor(data);
        setFormData({
          fullName: data.fullName || "",
          department:data.department || "",
          email: data.email || "",
          contact: data.contact || "",
          experience: data.experience || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          gender: data.gender || "",
          address: data.address || "",
          image: null
        });

        // Set initial image preview if profile image exists
        if (data && data.profile) {
          setCurrentImage(data.profile);
        } else {
          console.log("No profile image found in result");
        }


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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));    
      // Create preview for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  //edit
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const updatedData = {};

//   Object.keys(formData).forEach((key) => {
//     // Check for image fields (assuming they are File objects)
//     if (formData[key] instanceof File) {
//       // Check if a new image file is selected
//       if (formData[key].name !== "") {
//         updatedData[key] = formData[key];
//       }
//     } else {
//       // Check for changes in normal text/field values
//       if (formData[key] !== doctor[key]) {
//         updatedData[key] = formData[key];
//       }
//     }
//   });

//   if (Object.keys(updatedData).length === 0) {
//     alert("No changes detected.");
//     return;
//   }}

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id=localStorage.getItem("id");
    // formData object for file upload
    const formDataForSubmit = new FormData();
    
    // append text fields
    formDataForSubmit.append('fullName', formData.fullName);
    formDataForSubmit.append('department',formData);
    formDataForSubmit.append('email', formData.email);
    formDataForSubmit.append('contact', formData.contact);
    formDataForSubmit.append('address', formData.address);
    formDataForSubmit.append('dateOfBirth', formData.dateOfBirth);
    formDataForSubmit.append('gender', formData.gender);
    
    // append image if exists
    if (formData.image) {
      formDataForSubmit.append('image', formData.image);
    }

    try {
      const response = await fetch(`http://localhost:5000/auth/edit-doc/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataForSubmit
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Profile updated successfully!");
        // update local patient state with new data
      setDoctor(prevDoctor => ({
          ...prevDoctor,
          fullName: formData.fullName,
          department:formData.department,
          email: formData.email,
          contact: formData.contact,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          profile: result.profile || prevDoctor.profile
        }));

        if (result.profile) {
          setCurrentImage(result.profile);
        }
        setModalOpen(false);
      } else {
        toast.error(result.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading__spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }


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
  const closeModal = () => {
    setModalOpen(false);
    setImagePreview(null);
  };

  return (
    <>

    <DocBar />
      <div className="doctor-profile">
        <div className="doctor-profile__header">
          <div className="doctor-profile__header-content">
            <div className="doctor-profile__avatar">
              {currentImage && (
                <img 
                  src={currentImage} 
                  alt="Profile" 
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
              )}
            </div>
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
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Department</label>
              <p className="doctor-profile__value">{doctor.department || 'no desc'}</p>
            </div>
          </div>

          <div className="doctor-profile__card">
            <h2 className="doctor-profile__card-title">
              <span className="doctor-profile__icon"><IoCallOutline /></span>
              Contact Information
            </h2>
            <div className="doctor-profile__item">
              <label className="doctor-profile__label">Phone</label>
              <p className="doctor-profile__value">{doctor.contact || 'not available'}</p>
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
            <div className='doctor-form-head'>
              <h2>Edit Profile</h2>
              <button className='close-edit-modal-doc' onClick={() => setModalOpen(false)}><AiOutlineClose size={25}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>department</label>
                <input type='text' name="department" value={formData.department} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Contact Info</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  
                  <div className="image-preview-container-doc">
                    <p>New Image:</p>
                    <img 
                      src={imagePreview} 
                      alt="Profile Preview" 
                      className="image-preview-doc" 
                    />
                  </div>
                )}
                {currentImage && (
                  <div className="image-preview-container-doc">
                    <p>Current Image:</p>
                    <img 
                      src={currentImage} 
                      alt="Current Profile Preview" 
                      className="image-preview-doc" 
                    />
                  </div>
                )}
              </div>

              <div className="doctor-modal-buttons">
                <button type="submit" className="doctor-modal-save">Save</button>
                <button type="button" className="doctor-modal-close" onClick={closeModal}>Cancel</button>
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
