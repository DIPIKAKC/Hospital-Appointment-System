import { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import './AdminResourceManagement.css';
import AdminBar from '../../Components/Admin/SideBar';
import { Search, Plus, Edit2, Trash2, X, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDepartmentManagement() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResource, setCurrentResource] = useState({ type: '', total: '', available: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResources();
  },[]);

  const fetchResources= async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/resources', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();
      setResources(data.resources);
      setFilteredResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchTerm.toLowerCase();
  
    const filtered = resources.filter((resource) => {
      const type = resource.type?.toLowerCase() || '';
      // const total = resource.total?.toLowerCase() || '';
      // const available = resource.available?.toLowerCase() || '';

      return type.includes(search);
    });
  
    setFilteredResources(filtered);
  }, [resources, searchTerm]);



  const handleSubmitDelete = async (resourceId) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/admin/resources/delete/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete resource");
      }

      setShowDeleteConfirm(null);
      toast.success("Resource deleted successfully!");
      setResources(prev => prev.filter(ress => ress._id !== resourceId));      
    } catch (error) {
      console.error("Delete error:", error.message);
      toast.error("Error deleting resource: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEditResource = (resource) => {
    setCurrentResource(resource);
    setShowEditModal(true);
  };

  const handleDeleteResource = (resource) => {
    setCurrentResource(resource);
    setShowDeleteConfirm(true);
  };

  const handleAddNew = () => {
    setCurrentResource({ type: '', total: '', available: '' });
    setShowAddModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/add-resource', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentResource)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add resource");
      }

      setShowAddModal(false);
      toast.success("Resource added successfully!");
      await fetchResources();      
    } catch (error) {
      console.error("Add error:", error.message);
      toast.error("Error adding department: " + error.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    const resourceId = currentResource._id;
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/auth/admin/resources/edit/${resourceId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentResource)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update resource");
      }

      setShowEditModal(false);
      toast.success("Resource updated successfully!");
      await fetchResources();
      
    } catch (error) {
      console.error("Update error:", error.message);
      toast.error("Error updating department: " + error.message);
    }
  };

  // if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <AdminBar />
      <div className="admin-resource-container">
      <div className="admin-resource-header">
        <div className='admin-resource-heading'>
          <h1 className="admin-resource-title">Resource Management</h1>
          <p >Manage all hospital resources and their details</p>
        </div>
        <button className="admin-resource-back-btn" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={20} className='back-icon'/> Back to Dashboard</button>
      </div>

      <div className="admin-resource-content">
        <div className="admin-resource-search-filter">
        <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            className="admin-resource-search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="admin-resource-add-new-dept" onClick={handleAddNew} > <Plus size={20} className='admin-resource-plus-icon'/>Add New Resource</button>
        </div>

        {loading ? (
          <div className="admin-resource-table-loading">Loading resources...</div>
        ) : (
          <table className="admin-resource-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>TOTAL</th>
                <th>AVAILABLE</th>
                {/* <th>LAST UPDATED</th> */}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <tr key={resource._id}>
                  <td>{resource.type}</td>
                  <td>{resource.total}</td>
                  <td>{resource.available}</td>
                  {/* <td>{new Date(resource.lastUpdated).toLocaleString()}</td> */}
                    <td className="admin-resource-actions">
                      <button
                        className="admin-resource-edit-btn"
                        onClick={() => handleEditResource(resource)}
                      ><Edit2 size={15} className='admin-resource-edit-icon'/>
                        Edit
                      </button>
                      <button
                        className="admin-resource-delete-btn"
                        onClick={() => handleDeleteResource(resource)}
                      >
                        <Trash2 size={15} className='admin-resource-delete-icon'/>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    <div className="admin-resource-no-data">No departments found</div>
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
                  name="type"
                  value={currentResource.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Total:</label>
                <input
                  name="total" 
                  value={currentResource.total}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Available:</label>
                <input
                  name="available" 
                  value={currentResource.available}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-modal-btns">
                <button type="submit" className="u-s-btn">Save</button>
                <button type="button" className="u-c-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="u-modal-overlay">
          <div className="u-modal">
            <div className='u-head-resource-edit'>
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
                  name="type"
                  value={currentResource.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Total:</label>
                <input
                  name="total" 
                  value={currentResource.total}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Available:</label>
                <input
                  name="available" 
                  value={currentResource.available}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="u-res-edit-btns">
                <button type="submit" className="u-update-resource-btn" >Update</button>
                <button type="button" className="u-cancel-resource-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
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
              Are you sure you want to delete <strong>{currentResource.type}</strong> resource? This action cannot be undone.
            </p>
            <div className="delete-modal-buttons">
              <button onClick={() => setShowDeleteConfirm(null)} className="cancel-dlt-button">
                Cancel
              </button>
              <button onClick={() => handleSubmitDelete(currentResource._id)}className="ok-delete-button">
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



