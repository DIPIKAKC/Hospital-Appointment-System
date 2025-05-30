import React, { useEffect, useState } from "react";
import { MdAccessAlarms } from "react-icons/md";

import './Appointments.css';
import NavBar from "../../Components/User/Navbar";
import Resources from "../../Components/User/Resources";
import Footer from "../../Components/User/Footer";
import ReminderModal from "../../Components/User/Reminder";
import InitiatingKhaltiPayment from "../User/InitiatingKhaltiPayment"
import { toast } from "sonner";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const[isLoadingPayments, setIsLoadingPayments] = useState()

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({ name: '', description: '' });
  const [paymentsStatus, setPaymentsStatus] = useState({});
const [showKhaltiPaymentFor, setShowKhaltiPaymentFor] = useState(null); // store appointment ID



  // open modal for specific appointment
  const handleOpenReminder = (appointment) => {
    setSelectedAppointment(appointment);
    setShowReminderModal(true);
  };

    // to check if appointment is in the future
    const isFutureAppointment = (date, time) => {
      if (!date || !time) return false;
      const appointmentDateTime = new Date(`${date} ${time}`);
      const now = new Date();
      return appointmentDateTime > now;
    };

    useEffect(() => {
      fetchAppointments();
    }, []);

    useEffect(() => {
      if (appointments.length > 0) {
        paymentStatus();
      }
    }, [appointments]);
  
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch('http://localhost:5000/auth/appointments',
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch available slots");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setAppointments(data);
       }
       console.log("appointments:", data)
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };


  const cancelAppointment = async (id) => {
    // find the appointment in the current state
    const appointmentToCancel = appointments.find(app => app._id === id);

    // don't proceed if the appointment is already canceled
    if (appointmentToCancel.status === 'canceled') {
      toast.info("This appointment is already canceled");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/auth/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      toast.success("Appointment canceled successfully!");
      if (!response.ok) {
        toast.error("Failed to cancel appointment");
      }

      // local state to reflect the canceled appointment
      setTimeout(() => {
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment._id === id
              ? { ...appointment, status: 'canceled' }
              : appointment
          )
        );
      }, 2500);

    } catch (error) {
      console.error("Error canceling appointment", error);
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };


  // filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const isFuture = isFutureAppointment(appointment.date, appointment.time);

    switch (activeTab) {
      case 'upcoming':
        return appointment.status !== 'canceled' && isFuture;
      case 'past':
        return appointment.status !== 'canceled' && !isFuture;
      case 'cancelled':
        return appointment.status === 'canceled';
      default:
        return true;
    }
  });

    const handleCancelAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setShowDeleteConfirm(true);
  };

    const token=localStorage.getItem("token")
    const paymentStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/check-pay`,
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch payment status");
        }

        const data = await response.json();
        
        if (data.success && data.payments) {
          const paymentMap = {};
          data.payments.forEach((payment) => {
            paymentMap[payment.appointment] = payment.paymentStatus; // completed or pending
          });
        setPaymentsStatus(paymentMap);
        console.log("payments:",paymentMap)
        }

      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    // handle payment completion
  const handlePaymentSuccess = (appointmentId) => {
    setPaymentsStatus(prev => ({
      ...prev,
      [appointmentId]: 'completed',
    }));
    setShowKhaltiPaymentFor(null); // close the payment modal
    toast.success("Payment completed successfully!");
  };
    

return (
    <>
      <NavBar />

      <div className="apptlist-dashboard">
        <aside className="apptlist-sidebar">
          <button className={`apptlist-tab ${activeTab === 'all' ? 'apptlist-tab-active' : ''}`} onClick={() => setActiveTab('all')}>
            All Appointments
          </button>
          <button className={`apptlist-tab ${activeTab === 'upcoming' ? 'apptlist-tab-active' : ''}`} onClick={() => setActiveTab('upcoming')}>
            Upcoming Appointments
          </button>
          <button className={`apptlist-tab ${activeTab === 'past' ? 'apptlist-tab-active' : ''}`} onClick={() => setActiveTab('past')}>
            Past Appointments
          </button>
          <button className={`apptlist-tab ${activeTab === 'cancelled' ? 'apptlist-tab-active' : ''}`} onClick={() => setActiveTab('cancelled')}>
            Cancelled Appointments
          </button>
        </aside>

        <div className="apptlist-main">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <div className="apptlist-card" key={appointment._id || index}>
                <div className="apptlist-card-header">
                  <div className="apptlist-info-block">
                    <p className="apptlist-label">Date</p>
                    <p className="apptlist-value">{appointment.date || '--/--/----'}</p>
                  </div>
                  <div className="apptlist-info-block">
                    <p className="apptlist-label">Time</p>
                    <p className="apptlist-value">{appointment.time || '--'}</p>
                  </div>
                  <div className="apptlist-info-block">
                    <p className="apptlist-label">Status</p>
                    <p className="apptlist-value">{appointment.status || '--'}</p>
                  </div>
                </div>

                <div className="apptlist-card-body">
                  <div className="apptlist-info-block">
                    <p className="apptlist-label">Doctor</p>
                    <p className="apptlist-value">
                      {appointment.doctor ? appointment.doctor.fullName || 'Dr. Not Assigned' : 'Dr. Not Assigned'}
                    </p>
                  </div>
                  <div className="apptlist-info-block">
                    <p className="apptlist-label">Department</p>
                    <p className="apptlist-value">
                      {appointment.doctor ? appointment.doctor.department?.name || 'Not Specified' : 'Not Specified'}
                    </p>
                  </div>


{/* past current time? */}
                  <div className="apptlist-actions">
                    {appointment.status !== 'canceled' && appointment.status !== 'confirmed' && isFutureAppointment(appointment.date, appointment.time) &&(
                      <button className="apptlist-btn-cancel" 
                      onClick={() => handleCancelAppointment(appointment)}>
                        Cancel
                      </button>
                    )}

{/*status paid */}
                      {appointment.status === 'confirmed' && (
                        <div className="apptlist-payment-section">
                          {isLoadingPayments ? (
                            <span>Loading payment status...</span>
                          ) : paymentsStatus[appointment._id] === 'completed' ? (
                            <span className="already-paid-text">Paid</span>
                          ) : isFutureAppointment(appointment.date, appointment.time) ? (
                            <>
                              <button
                                className="apptlist-btn-payment"
                                onClick={() => setShowKhaltiPaymentFor(appointment._id)}
                              >
                                Pay with Khalti
                              </button>
                              {showKhaltiPaymentFor === appointment._id && (
                                <InitiatingKhaltiPayment
                                  appointment={appointment}
                                  onPaymentSuccess={() => handlePaymentSuccess(appointment._id)}
                                  onClose={() => setShowKhaltiPaymentFor(null)}
                                />
                              )}
                            </>
                          ) : null}
                        </div>
                      )}
{/*  */}
                    {appointment.status !== 'canceled' && isFutureAppointment(appointment.date, appointment.time) &&  (
                    <button className="apptlist-btn-reminder" onClick={() => handleOpenReminder(appointment)}>
                      <MdAccessAlarms size={15} /> Set Reminder
                    </button>
                    )}


                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="apptlist-empty-state">
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>

      <Resources />
      <Footer />

      {showReminderModal && selectedAppointment && (
        <ReminderModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowReminderModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}


      {/* delete modal */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="delete-icon">
              </div>
              <h3 className="delete-title">Cancel Appointment</h3>
            </div>
            <p className="delete-message">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="delete-modal-buttons">
              <button onClick={() => setShowDeleteConfirm(false)} className="cancel-dlt-button">
                Cancel
              </button>
              <button onClick={() => {cancelAppointment(currentAppointment._id);             
                                      setShowDeleteConfirm(false); // Close the modal after confirming
              }} className="ok-delete-button">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default AppointmentList;




