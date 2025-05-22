import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDepartmentManagement.css';
import AdminBar from '../../Components/Admin/SideBar';
import { Search, Plus, Edit2, Trash2, X, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
  },[]);

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

  const handleSubmitDelete = async (departmentId) => {

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

      setShowDeleteConfirm(null);
      toast.success("Department deleted successfully!");
      setDepartments(prev => prev.filter(dept => dept._id !== departmentId));      
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting department: " + error.message);
    }
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setShowEditModal(true);
  };

  const handleDeleteDepartment = (department) => {
    setCurrentDepartment(department);
    setShowDeleteConfirm(true);
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
      const response = await fetch('http://localhost:5000/auth/add-department', {
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

      setShowAddModal(false);
      toast.success("Department added successfully!");
      await fetchDepartments();      
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

      setShowEditModal(false);
      toast.success("Department updated successfully!");
      await fetchDepartments();
      
    } catch (error) {
      console.error("Update error:", error.message);
      alert("Error updating department: " + error.message);
    }
  };

  // if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <AdminBar />
      <div className="department-container">
      <div className="department-header">
        <div className='department-heading'>
          <h1 className="department-title">Department Management</h1>
          <p >Manage all hospital departments and their details</p>
        </div>
        <button className="department-back-btn" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={20} className='back-icon'/> Back to Dashboard</button>
      </div>

      <div className="department-content">
        <div className="department-search-filter">
        <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search departments..."
            className="department-search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-new-dept" onClick={handleAddNew} > <Plus size={20} className='plus-icon'/>Add New Department</button>
        </div>

        {loading ? (
          <div className="table-loading">Loading departments...</div>
        ) : (
          <table className="department-table">
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
                    <td className="department-actions">
                      <button
                        className="edit-department-btn"
                        onClick={() => handleEdit(department)}
                      ><Edit2 size={15} className='edit-icon'/>
                        Edit
                      </button>
                      <button
                        className="delete-department-btn"
                        onClick={() => handleDeleteDepartment(department)}
                      >
                        <Trash2 size={15} className='delete-icon'/>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    <div className="no-department-data">No departments found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="u-modal-overlay">
          <div className="u-modal">
            <div className='u-head'>
            <h2>Add New Department</h2>
            <button onClick={() => setShowAddModal(false)} className='wrong'>
                <X size={25} />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd}>
              <div className="u-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentDepartment.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={currentDepartment.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-modal-btns">
                <button type="submit" className="u-save-dept-btn">Save</button>
                <button type="button" className="u-nosave-dept-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="u-modal-overlay">
          <div className="u-modal">
            <div className='u-modal-head-edit'>
              <h2>Edit Department</h2>
              <button onClick={() => setShowEditModal(false)} className='wrong'>
                  <X size={25} />
                </button>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="u-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentDepartment.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Description:</label>
                <textarea
                  name="description" 
                  value={currentDepartment.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-modal-btns">
                <button type="submit" className="u-update-dept-btn" >Update</button>
                <button type="cancel" className="u-cancel-dept-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete modal */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="delete-icon">
              </div>
              <h3 className="delete-title">Delete Department</h3>
            </div>
            <p className="delete-message">
              Are you sure you want to delete <strong>{currentDepartment.name}</strong> department? This action cannot be undone.
            </p>
            <div className="delete-modal-buttons">
              <button onClick={() => setShowDeleteConfirm(null)} className="cancel-dlt-button">
                Cancel
              </button>
              <button onClick={() => handleSubmitDelete(currentDepartment._id)} className="ok-delete-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

    </>
  );
}



