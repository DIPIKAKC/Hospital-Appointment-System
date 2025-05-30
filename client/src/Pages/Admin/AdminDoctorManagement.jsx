import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDoctorManagement.css';
import AdminBar from '../../Components/Admin/SideBar';
import { Search, Edit2, Trash2, X, ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AdminAddDoctor from './AdminAddDoctor';
import AdminUpdateDoctor from './AdminEditDoctor';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

      // create a mapping of department IDs to department names
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
      const departmentName = departmentMap[doctor.department] || doctor.department || '';

      const matchesSearch = name.includes(search);
  
      // filter by department (using the name, not ID)
      const matchesDept =
        selectedDepartment === 'All Departments' ||
        departmentName.toLowerCase() === selectedDepartment.toLowerCase();
  
      return matchesSearch && matchesDept;
    });
  
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedDepartment, departmentMap]);
  

  const handleDelete = async (doctorId) => {
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

      setShowDeleteConfirm(false);
      toast.success("Doctor removed successfully");
      setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
    } catch (error) {
      console.error("Delete error:", error.message);
      toast.error("Error deleting doctor: " + error.message);
    }
  };


  const handleEdited = () => {
    setShowEditModal(false);
    toast.success("Doctor updated successfully!");
    fetchDoctors();
  };
  
  const handleDoctorAdded = () => {
    setShowAddModal(false);
    toast.success("Doctor added successfully!");
    fetchDoctors();
  };  

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <AdminBar />
    <div className="doctor-container">
      <div className="doctor-header">
        <div className='doctor-heading'>
          <h1 className="doctor-head-title">Doctor Management</h1>
          <p >Manage all hospital doctors and their details</p>
        </div>
        <button className="doctor-back-button" onClick={() => navigate('/admin/dashboard')}><ArrowLeft size={20} className='back-doc'/>Back to Dashboard</button>
      </div>

      <div className="doctor-content-box">
        <div className="searching-doctor">
          <Search size={18} className="search-doc" />
          <input
            type="text"
            placeholder="Search by doctor name or department..."
            className="doctor-search-in"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
    
          <select
            className="doctor-department-select"
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
          <button className='add-new-doc' onClick={() => setShowAddModal(true)}> 
            <Plus size={18} className='plus-doc'/>
            Add New Doctor
          </button>
        </div>

        <table className="doctor-information-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>DEPARTMENT</th>
              <th>FEE</th>
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
                  <td>{doctor.doctorfee}</td>
                  <td>{doctor.contact}</td>
                  <td className="doctor-action-buttons">

                    <button
                      className="doctor-edit-button"
                      onClick={() =>{ 
                        setSelectedDoctor(doctor)
                        setShowEditModal(true)
                      }}  

                    ><Edit2 size={15} className='edit-doc'/>
                      Edit
                    </button>
                    <button
                      className="doctor-delete-button"
                      onClick={() => setShowDeleteConfirm(doctor)}
                    ><Trash2 size={15} className='delete-doc'/>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="doctor-no-data">No doctors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className="adddoc-modal-overlay">
          <div className="adddoc-modal-content">
            <button className="adddoc-close-modal" onClick={() => setShowAddModal(false)}><X /></button>
            <AdminAddDoctor 
              onClose={() => setShowAddModal(false)} 
              onSuccess={handleDoctorAdded} 
            />          
          </div>
        </div>
      )}

      {/* edit modal */}
      {showEditModal && (
        <div className="editdoc-modal-overlay">
          <div className="editdoc-modal-content">
            <button className="editdoc-close-modal" onClick={() => setShowEditModal(false)}><X /></button>
            <AdminUpdateDoctor 
              doctorId={selectedDoctor._id}       // Pass doctor ID directly
              onClose={() => setShowEditModal(false)} 
              onSuccess={handleEdited}     
            />    
          </div>
        </div>
      )}

      {/* delete modal */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3 className="delete-title">Delete Doctor</h3>
            </div>
            <p className="delete-message">
              Are you sure you want to remove <strong>{showDeleteConfirm.fullName}</strong> as a doctor? This action cannot be undone.
            </p>
            <div className="delete-modal-buttons">
              <button onClick={() => setShowDeleteConfirm(null)} className="cancel-dlt-button">
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(showDeleteConfirm._id);
                  setShowDeleteConfirm(null); 
                }}
                className="ok-delete-button"
              >
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
