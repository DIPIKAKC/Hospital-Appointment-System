import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAppointmentManagement.css';

export default function AdminAppointmentManagement() {

  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredAppointments, setFilteredAppointments] = useState ([])
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const statusOptions = ['All Status', 'Pending', 'Confirmed', 'Completed', 'Canceled'];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/auth/admin/appointments', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);


  useEffect(() => {
    const search = searchTerm.toLowerCase();
  
    const filtered = appointments.filter(appointment => {
      const patientName = appointment.user?.fullName?.toLowerCase() || '';
      const doctorName = appointment.doctor?.fullName?.toLowerCase() || '';
      const department = appointment.doctor?.department?.toLowerCase() || '';
      const status = appointment.status?.toLowerCase() || '';
  
      const matchesSearch = search
        ? patientName.includes(search) ||
          doctorName.includes(search) ||
          department.includes(search) ||
          status.includes(search)
        : true;
  
      const matchesStatus = selectedStatus === 'All Status' ||
        status === selectedStatus.toLowerCase();
  
      return matchesSearch && matchesStatus;
    });
  
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, selectedStatus]);
  
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">Error: {error}</div>;


  //delete
  const handleDelete = async (appointmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`http://localhost:5000/auth/admin/appointments/delete/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete appointment");
      }
  
      // Remove deleted appointment from state
      setAppointments(prev => prev.filter(appointment => appointment._id !== appointmentId));
      alert(result.message);
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting appointment: " + error.message);
    }
  };
  


  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Appointment Management</h1>
        <button className="back-button">Back to Dashboard </button>
      </div>

      <div className="content-box">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <table className="appointments-table">
          <thead>
            <tr>
              <th>PATIENT NAME</th>
              <th>DOCTOR NAME</th>
              <th>DEPARTMENT</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <tr key={appointment._id}>
                  <td>{appointment.user?.fullName || 'Unknown'}</td>
                  <td>{appointment.doctor?.fullName || 'Unknown'}</td>
                  <td>{appointment.doctor?.department || 'Unknown'}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <span className={`status-badge ${appointment.status?.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {/* <button className="edit-button">Edit</button>
                    <button className="view-button">View</button> */}
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
