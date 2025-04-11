import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDoctorManagement.css';

export default function AdminDoctorManagement() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentMap, setDepartmentMap] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  },[]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/admin/doctors', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
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

      // Create a mapping of department IDs to department names
      const deptMap = {};
      data.forEach(dept => {
        deptMap[dept._id] = dept.name;
      });
      setDepartmentMap(deptMap);

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const search = searchTerm.toLowerCase();
  
    const filtered = doctors.filter((doctor) => {
      const name = doctor.fullName?.toLowerCase() || '';
      // Get the department name from our map or use the department ID as fallback
      const departmentName = departmentMap[doctor.department] || doctor.department || '';

      // Search only by name
      const matchesSearch = name.includes(search);
  
      // Filter by department (using the name, not ID)
      const matchesDept =
        selectedDepartment === 'All Departments' ||
        departmentName.toLowerCase() === selectedDepartment.toLowerCase();
  
      return matchesSearch && matchesDept;
    });
  
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedDepartment, departmentMap]);
  

  const handleDelete = async (doctorId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/auth/admin/doctors/delete/${doctorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete doctor");
      }

      setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
      alert(result.message);
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting doctor: " + error.message);
    }
  };


  const handleEdit = (doctorId) => {
    // Redirect to the edit page with doctorId
    navigate(`/admin/doctors/edit/${doctorId}`);
  };
  
  

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Doctor Management</h1>
        <button className="back-button" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="content-box">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by doctor name or department..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="department-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option>All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <table className="doctors-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>DEPARTMENT</th>
              <th>CONTACT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doctor => (
                <tr key={doctor._id}>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.email}</td>
                  <td>{departmentMap[doctor.department] || doctor.department}</td>
                  <td>{doctor.contact}</td>
                  <td className="action-buttons">

                    <button
                      className="edit-button"
                      onClick={() => handleEdit(doctor._id)}  // Edit button triggers the handleEdit function
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(doctor._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No doctors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
