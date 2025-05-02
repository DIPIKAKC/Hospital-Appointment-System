import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddDepartment.css";
import { X } from "lucide-react";

const AdminAddDepartment = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [showAddModal, setShowAddModal] = useState(true); // Modal shown by default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
              <>
                {showAddModal && (
                  <div className="dept-add-modal-overlay">
                    <div className="dept-add-modal">
                      <div className="dept-add-head">
                        <h2>Add New Department</h2>
                        <button onClick={() => setShowAddModal(false)} className="wrong">
                          <X size={25} />
                        </button>
                      </div>
          
                      {error && <div className="error-message">{error}</div>}
                      {success && <div className="success-message">{success}</div>}
          
                      <form onSubmit={handleAddDepartments}>
                        <div className="dept-add-form-group">
                          <label>Name:</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="dept-add-form-group">
                          <label>Description:</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="dept-add-modal-btns">
                          <button type="submit" className="dept-add-s-btn" disabled={loading}>
                            {loading ? "Adding..." : "Save"}
                          </button>
                          <button type="button" className="dept-add-c-btn" onClick={() => setShowAddModal(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            );
          };

export default AdminAddDepartment;