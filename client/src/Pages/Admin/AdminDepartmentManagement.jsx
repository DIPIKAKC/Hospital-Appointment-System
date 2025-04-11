import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDepartmentManagement.css';

export default function AdminDepartmentManagement() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({ name: '', description: '' });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/admin/departments', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchTerm.toLowerCase();
  
    const filtered = departments.filter((department) => {
      const name = department.name?.toLowerCase() || '';
      const description = department.description?.toLowerCase() || '';

      return name.includes(search) || description.includes(search);
    });
  
    setFilteredDepartments(filtered);
  }, [departments, searchTerm]);

  const handleDelete = async (departmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/auth/admin/departments/delete/${departmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete department");
      }

      setDepartments(prev => prev.filter(department => department._id !== departmentId));
      alert(result.message);
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting department: " + error.message);
    }
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    setCurrentDepartment({ name: '', description: '' });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/admin/departments/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentDepartment)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add department");
      }

      await fetchDepartments();
      setShowAddModal(false);
      alert("Department added successfully!");
    } catch (error) {
      console.error("Add error:", error.message);
      alert("Error adding department: " + error.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    const departmentId = currentDepartment._id;
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/auth/admin/departments/edit/${departmentId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentDepartment)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update department");
      }

      await fetchDepartments();
      setShowEditModal(false);
      alert("Department updated successfully!");
    } catch (error) {
      console.error("Update error:", error.message);
      alert("Error updating department: " + error.message);
    }
  };

  if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Department Management</h1>
        <button className="back-button" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="content-box">
        <div className="filters">
          <input
            type="text"
            placeholder="Search departments..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-button" onClick={handleAddNew}>Add New Department</button>
        </div>

        <table className="departments-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>DESCRIPTION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map(department => (
                <tr key={department._id}>
                  <td>{department.name}</td>
                  <td>{department.description}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(department)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(department._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">No departments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Department</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentDepartment.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={currentDepartment.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Department</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentDepartment.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description" 
                  value={currentDepartment.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">Update</button>
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}