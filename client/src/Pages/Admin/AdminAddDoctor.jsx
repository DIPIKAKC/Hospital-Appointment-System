import React, { useState, useEffect } from "react";
import "./AdminAddDoctor.css";

const AdminAddDoctor = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    experience: "",
    description: "",
    contact: ""
  });
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingDepartments, setLoadingDepartments] = useState(true);


    // Fetch departments from separate database
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/departments")  
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setDepartments(data);
                }
            } catch (error) {
                console.error("Error fetching department data:", error);
            }finally {
                setLoadingDepartments(false); // <-- You need this!
              }
        };
        
        fetchDepartments();
    }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //add doctor
    const handleAddDoctor = async(e) => {
        e.preventDefault(); // Prevent default form submit behavior
        setLoading(true);
        setError("");
        setSuccess("");

    try {
      // Prepare data for the API
      const doctorData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        experience: formData.experience,
        description: formData.description,
        contact: formData.contact,
        role: "doctor"
      };
      
      // Replace with your API call implementation
      const response = await fetch("http://localhost:5000/auth/add-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(doctorData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error adding doctor");
      }


      // Handle success
      setSuccess("Doctor added successfully!", data);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        department: "",
        experience: "",
        description: "",
        contact: ""
      });
      if (onSuccess) {
        onSuccess(data);
      }

    } catch (err) {
      setError(err.message || "Error adding doctor");
    }
  };


  return (
      <div className="content-wrapper">
        <div className="header">
          <h1>Add New Doctor</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-container">
          <form onSubmit={handleAddDoctor}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Doctor's name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="doctor@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="********"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                {loadingDepartments ? (
                  <div className="loading-indicator">Loading departments...</div>
                ) : (
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="department-select"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id || dept.id} value={dept._id || dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>


            <div className="form-group">
                <label htmlFor="contact">Contact *</label>
                <input
                  type="contact"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="contact info"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <input
                  type="description"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="doctor's description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">Experience *</label>
                <input
                  type="experience"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  placeholder="experience"
                />
              </div>
              
            <div className="form-footer">
              <button
                type="submit"
                disabled={loading}
                className={loading ? "submit-button loading" : "submit-button"}
              >
                {loading ? "Adding..." : "Add Doctor"}
                se
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AdminAddDoctor;