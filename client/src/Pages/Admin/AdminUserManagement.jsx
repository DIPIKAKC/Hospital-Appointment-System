import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUserManagement.css';
import AdminBar from '../../Components/Admin/SideBar';
import { Search, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    // fetchUserRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/admin/users', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const search = searchTerm.toLowerCase();
  
    const filtered = users.filter((user) => {
      const name = user.fullName?.toLowerCase() || '';

      // Search by name or email
      const matchesSearch = name.includes(search);
  
      return matchesSearch;
    });
  
    setFilteredUsers(filtered);
  }, [users, searchTerm]);
  
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/admin/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      setShowDeleteConfirm(null);
      setSelectedUser(null)
      fetchUsers();
      toast.success("User deleted successfully!");
      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting user: " + error.message);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <AdminBar />
    <div className="admin-user-container">
      <div className="admin-user-header">
      <div className='admin-user-heading'>
        <h1 className="admin-user-title">User Management</h1>
        <p >Manage all hospital users and their details</p>
      </div>
      <button className="admin-user-back-button" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={20} className='back-doc'/>Back to Dashboard</button>
      </div>

      <div className="admin-user-content-box">
        <div className="admin-user-search">
        <Search size={18} className="search-user" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="admin-user-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="admin-users-info-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>CREATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="admin-user-actions">
                    <button
                      className="admin-user-delete-button"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 size={15} className='delete-user'/>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="admin-user-no-data">No users found</td>
              </tr>
            )}
          </tbody>
        </table>

         {/* delete modal */}
          {showDeleteConfirm && (
            <div className="delete-user-modal-overlay">
              <div className="delete-user-modal">
                <div className="delete-user-modal-header">
                  <div className="delete-user-icon">
                  </div>
                  <h3 className="delete-user-title">Delete User</h3>
                </div>
                <p className="delete-user-message">
                  Are you sure you want to remove <strong>{selectedUser.fullName}</strong> as an user? This action cannot be undone.
                </p>
                <div className="delete-user-modal-buttons">
                  <button onClick={() => setShowDeleteConfirm(null)} className="cancel-dlt-button-user">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(selectedUser._id)} className="ok-delete-button-user">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
    </>
  );
}