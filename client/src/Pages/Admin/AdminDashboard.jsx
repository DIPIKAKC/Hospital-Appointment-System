import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminBar from '../../Components/Admin/SideBar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0
  });

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
  const handleAddDoctor = () => navigate('/admin/add-doctor');
  const handleAddDepartment = () => navigate('/admin/add-department');

  return (
      <>
      <AdminBar />
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

          <div className="admin-home-quick-actions">
            <h3>Quick Actions</h3>
            <div className="admin-home-action-buttons">
              <button className="admin-home-action-btn add-doctor" onClick={handleAddDoctor}>Add New Doctor</button>
              <button className="admin-home-action-btn add-doctor" onClick={handleAddDepartment}>Add New Department</button>
            </div>
          </div>
        </div>
    </>
  );
};

export default AdminDashboard;
