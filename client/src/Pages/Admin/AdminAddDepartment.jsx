import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddDoctor.css";

const AdminAddDepartment = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDepartments = async (e) => {

        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError("");
        setSuccess("");

            try {
                // Replace with your API call implementation
                const response = await fetch("http://localhost:5000/auth/add-department", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error adding department");
                }


                // Handle success
                setSuccess("Department added successfully:", data);
                
                // Redirect after success
                setTimeout(() => {
                    navigate("/admin/departments");
                }, 2000);
                } catch (err) {
                setError(err.message || "Error adding doctor");
                }
            };
  


  return (
    <div className="admin-add-doctor-container">
      <div className="content-wrapper">
        <div className="header">
          <h1>Add New Department</h1>
          <a href="/admin/dashboard" className="back-button">
            Back to Dashbaord
          </a>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-container">
          <form onSubmit={handleAddDepartments}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Department's Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=""
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
                  placeholder="********"
                />
              </div>
            </div>
            <div className="form-footer">
              <button
                type="submit"
                disabled={loading}
                className={loading ? "submit-button loading" : "submit-button"}
              >
                {loading ? "Adding..." : "Add Department"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
    };


export default AdminAddDepartment;