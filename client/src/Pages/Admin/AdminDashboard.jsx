import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminBar from '../../Components/Admin/SideBar';
import { BsPersonAdd } from "react-icons/bs";
import { GoFileDirectory } from "react-icons/go";
import AdminAddDoctor from './AdminAddDoctor';
import AdminAddDepartment from './AdminAddDepartment';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/admin/stats', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setStats({
          users: data?.users || 0,
          doctors: data?.doctors || 0,
          appointments: data?.appointments || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, [token]);


  const handleNavigate = (path) => navigate(path);
  // const handleAddDoctor = () => navigate('/admin/add-doctor');
  // const handleAddDepartment = () => navigate('/admin/add-department');

  const handleDoctorAdded = () => {
    setShowAddModal(false);
    toast.success("Doctor added successfully!");
  };
  
  return (
      <>
      <AdminBar />

      <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p >Manage the hospital system</p>
      </div>

        <h2 className='overview'>Dashboard Overview</h2>
        <div className="admin-home-dashboard-content">
          <div className="admin-home-stats-container">
            <div className="admin-home-stat-card blue">
              <h3>Total Users</h3>
              <p className="admin-home-stat-value">{stats.users}</p>
              <a className="admin-home-view-link" onClick={() => handleNavigate('/admin/users')}>View All Users →</a>
            </div>

            <div className="admin-home-stat-card green">
              <h3>Total Doctors</h3>
              <p className="admin-home-stat-value">{stats.doctors}</p>
              <a className="admin-home-view-link" onClick={() => handleNavigate('/admin/doctors')}>View All Doctors →</a>
            </div>

            <div className="admin-home-stat-card purple">
              <h3>Total Appointments</h3>
              <p className="admin-home-stat-value">{stats.appointments}</p>
              <a className="admin-home-view-link" onClick={() => handleNavigate('/admin/appointments')}>View All Appointments →</a>
            </div>
          </div>
          </div>

          <div className="admin-home-quick-actions">
            <h3>Quick Actions</h3>
            <div className="admin-home-action-buttons">
              <button className="admin-home-action-btn add-doctor" onClick={() => setShowAddModal(true)}>
                <div className="admin-home-icon-circle" style={{ backgroundColor: "#d1f5d3", color: "#28a745" }}>
                  <BsPersonAdd />
                </div>
                <div className="admin-home-action-label">Add Doctor</div>
              </button>

              <button className="admin-home-action-btn add-department" onClick={() => setShowDepartmentModal(true)}>
                <div className="admin-home-icon-circle" style={{ backgroundColor: "#e6f0ff", color: "#007bff" }}>
                  <GoFileDirectory />
                </div>
                <div className="admin-home-action-label">Add Department</div>
              </button>
            </div>
          </div>

          {/* doctor add modal */}
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
          {showDepartmentModal && <AdminAddDepartment onClose={() => setShowDepartmentModal(false)} />}

      </div>
    </>
  );
};

export default AdminDashboard;
