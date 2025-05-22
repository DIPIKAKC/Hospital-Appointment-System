import React, { useState, useEffect } from "react";
import "./AdminAddDoctor.css";

const AdminUpdateDoctor = ({ doctorId, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    experience: "",
    description: "",
    contact: "",
    doctorfee: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingDepartments, setLoadingDepartments] = useState(true);


  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/departments");
        const data = await response.json();

        if (Array.isArray(data)) {
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error fetching department data:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch doctor data for editing
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/doctor/${doctorId}`);
        const data = await response.json();
        
        if (response.ok) {
          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            department: data.department?._id || "", //department as an object
            experience: data.experience || "",
            description: data.description || "",
            doctorfee: data.doctorfee || "",
            contact: data.contact || ""
          });
        } else {
          throw new Error("Doctor data not found.");
        }
      } catch (error) {
        setError("Error fetching doctor data: " + error.message);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle doctor update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
 
    try {
      const doctorData = {
        fullName: formData.fullName,
        email: formData.email,
        department: formData.department,
        experience: formData.experience,
        description: formData.description,
        doctorfee:formData.doctorfee,
        contact: formData.contact
      };

      const response = await fetch(`http://localhost:5000/auth/admin/doctors/edit/${doctorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(doctorData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error updating doctor data");
      }

      // Handle success
      setSuccess("Doctor updated successfully!");
      if(onSuccess){
        onSuccess(data);
      }


    } catch (err) {
      setError(err.message || "Error updating doctor data");
    }
  };

  return (
      <div className="content-wrapper">
        <div className="header">
          <h1>Edit Doctor</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
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
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="Contact number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Experience *</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="Experience"
              />
            </div>

            <div className="form-group">
              <label htmlFor="doctorfee">Fee *</label>
              <input
                type="text"
                id="doctorfee"
                name="doctorfee"
                value={formData.doctorfee}
                onChange={handleChange}
                required
                placeholder="Fee"
              />
            </div>

            <div className="form-footer">
              <button
                type="submit"
                disabled={loading}
                className={loading ? "submit-button loading" : "submit-button"}
              >
                {loading ? "Processing..." : "Update Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AdminUpdateDoctor;
