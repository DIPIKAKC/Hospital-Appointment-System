import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUserManagement.css';
import AdminBar from '../../Components/Admin/SideBar';

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    // fetchUserRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/admin/users', {
        mathod: "GET",
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
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

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
      setUsers(prev => prev.filter(user => user._id !== userId));

      alert(result.message);
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting user: " + error.message);
    }
  };

  // const handleEdit = (userId) => {
  //   navigate(`/admin/users/edit/${userId}`);
  // };
  
  // const handleActivateDeactivate = async (userId, currentStatus) => {
  //   try {
  //     const newStatus = !currentStatus;
  //     const response = await fetch(`http://localhost:5000/auth/admin/users/status/${userId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ active: newStatus })
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || "Failed to update user status");
  //     }

  //     // Update the user's status in the state
  //     setUsers(prev => 
  //       prev.map(user => 
  //         user._id === userId ? { ...user, active: newStatus } : user
  //       )
  //     );
      
  //     alert(newStatus ? "User activated successfully" : "User deactivated successfully");
  //   } catch (error) {
  //     console.error("Status update error:", error.message);
  //     alert("Error updating user status: " + error.message);
  //   }
  // };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <AdminBar />
    <div className="container">
      <div className="header">
        <h1 className="title">User Management</h1>
        <button className="back-button" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="content-box">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="users-table">
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
                <tr key={user._id} className={!user.active ? "inactive-user" : ""}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  {/* <td className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(user._id)}
                    >
                      Edit
                    </button> */}
                    {/* <button
                      className={user.active ? "deactivate-button" : "activate-button"}
                      onClick={() => handleActivateDeactivate(user._id, user.active)}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button> */}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  {/* </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}