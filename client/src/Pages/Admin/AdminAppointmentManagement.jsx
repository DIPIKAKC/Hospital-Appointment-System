import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAppointmentManagement.css';
import { Search, Trash2, ArrowLeft } from 'lucide-react';
import AdminBar from '../../Components/Admin/SideBar';
import { toast } from 'sonner';

export default function AdminAppointmentManagement() {

  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState ([])
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusOptions = ['All Status', 'Pending', 'Confirmed', 'Completed', 'Canceled'];

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchAppointments();
  }, []);

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
        console.log(data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    const search = searchTerm.toLowerCase();
  
    const filtered = appointments.filter(appointment => {
      const patientName = appointment.user?.fullName?.toLowerCase() || '';
      const doctorName = appointment.doctor?.fullName?.toLowerCase() || '';
      const department = appointment.doctor?.department?.name?.toLowerCase() || '';
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

  
  
  
  //delete
  const handleDelete = async (appointmentId) => {
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
      setShowDeleteConfirm(null);
      fetchAppointments();
      toast.success("Appointment deleted successfully!");
      setAppointments(prev => prev.filter(appointment => appointment._id !== appointmentId));
    } catch (error) {
      console.error("Delete error:", error.message);
      toast.error("Error deleting appointment: " + error.message);
    }
  };
  
  const handleDeleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteConfirm(true);
  };

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  
  return (
    
    <>
    <AdminBar />
    <div className="admin-appt-container">
      <div className="admin-appt-header">
      <div className='admin-appt-heading'>
        <h1 className="admin-appt-title">Appointment Management</h1>
        <p >Manage all hospital appointment and their details</p>
      </div>
        <button className="admin-appt-back-button" onClick={() => navigate('/admin/dashboard')}> <ArrowLeft size={20} />Back to Dashboard </button>
      </div>

      <div className="admin-appt-content-box">
        <div className="admin-appt-search-filters">
        <Search size={18} className="admin-appt-search" />
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            className="admin-appt-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="admin-appt-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <table className="admin-appt-table">
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
                  <td>{appointment.doctor?.department?.name || 'Unknown'}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <span className={`admin-appt-status ${appointment.status?.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="admin-appt-action-buttons">
                    <button 
                      className="admin-appt-delete-button"
                      onClick={() => handleDeleteAppointment(appointment)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="admin-appt-no-data">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="delete-appointment-modal-overlay">
              <div className="delete-appointment-modal">
                <h3 className="delete-title">Delete Appointment</h3>
                <p>
                  Are you sure you want to delete the appointment for <strong>{selectedAppointment?.user?.fullName}</strong> on <strong>{selectedAppointment?.date}</strong> at <strong>{selectedAppointment?.time}</strong>? This action cannot be undone.
                </p>
                <div className="modal-buttons">
                  <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button className="confirm-delete-btn" 
                    onClick={() => {
                      handleDelete(selectedAppointment._id);
                      setShowDeleteConfirm(false);
                    }}>Delete</button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
    </>
  );
}
