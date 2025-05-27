import React, { useState, useEffect } from "react";
import "./MyAssignedAppointments.css";
import DocBar from "../../Components/Doctor/DoctorNavbar";
import FooterDoc from "../../Components/Doctor/FooterDoctor";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "sonner";

const DoctorAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [appointmentToUpdate, setAppointmentToUpdate] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    all: true,
    upcoming: true,
    past: false, // 'Past' starts off unchecked
    pastDays: 7, // Default to 7 days for 'Past' filter
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/auth/my-assigned-appointments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Appointment updated successfully");
      console.log(data);

      // Refresh appointments after update
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status, notes } : appt))
      );
      setAppointmentToUpdate(null);
      setNotes("");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const today = new Date();
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredAppointments = sortedAppointments.filter((appointment) => {
    const apptDate = new Date(appointment.date);
    const isUpcoming = apptDate >= new Date(new Date().setHours(0, 0, 0, 0));
    const isPast = apptDate < new Date(new Date().setHours(0, 0, 0, 0));

    // Calculate past date limits (7 or 30 days ago)
    const pastDateLimit = new Date(today);
    pastDateLimit.setDate(today.getDate() - filters.pastDays); // Adjust to 7 or 30 days ago

    // Filter appointments based on the selected filters
    return (
      (filters.all && isUpcoming) ||
      (filters.upcoming && isUpcoming) ||
      (filters.past && isPast && apptDate >= pastDateLimit)
    );
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
      pastDays: name === "past" && checked ? 7 : prev.pastDays, // Default to 7 days if past is checked
    }));
  };

  const handlePastDaysChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      pastDays: Number(e.target.value), // Ensure pastDays is a number (7 or 30)
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <>
      <DocBar />
      <div className="doctor-appointments-container">
        <h2 className="page-title">Patient Appointment Requests</h2>

        {/* Filter Bar */}
        <div className="filter-bar">
          <label>
            <input
              type="checkbox"
              name="all"
              checked={filters.all}
              onChange={handleCheckboxChange}
            />
            All
          </label>
          <label>
            <input
              type="checkbox"
              name="upcoming"
              checked={filters.upcoming}
              onChange={handleCheckboxChange}
            />
            Upcoming
          </label>

          <label>
            <input
              type="checkbox"
              name="past"
              checked={filters.past}
              onChange={handleCheckboxChange}
            />
            Past
          </label>

          {filters.past && (
            <div>
              <select value={filters.pastDays} className="sort-days" onChange={handlePastDaysChange}>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </div>
          )}

        </div>

        {/* Modal for updating appointment status */}
        {appointmentToUpdate && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">
                {appointmentToUpdate.status === "confirmed" ? "Accept Appointment" : "Reject Appointment"}
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about the appointment (optional)"
                className="modal-textarea"
              ></textarea>
              <div className="modal-buttons">
                <button onClick={() => setAppointmentToUpdate(null)} className="button-cancel">
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateAppointmentStatus(appointmentToUpdate.id, appointmentToUpdate.status)
                  }
                  className={`status-button ${
                    appointmentToUpdate.status === "confirmed" ? "accept" : "reject"
                  }`}
                >
                  {appointmentToUpdate.status === "confirmed" ? "Accept" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><IoCalendarOutline/></div>
            <h3>No appointment requests</h3>
            <p>No appointments match the selected filters.</p>
          </div>
        ) : (
          <div className="appointment-cards-grid">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="card-appointment">
                <div className="card-status-banner" data-status={appointment.status}></div>
                <div className="card-content">
                  <div className="appointment-header">
                    <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
                    <span className="appointment-time">
                      {formatDate(appointment.date)} at {appointment.time}
                    </span>
                  </div>

                  <div className="patient-info">
                    <h3>{appointment.user?.fullName || "Unknown Patient"}</h3>
                    <p className="patient-email">{appointment.user?.email || "No email"}</p>
                  </div>

                  <div className="appointment-reason">
                    <label>Reason for visit:</label>
                    <p>{appointment.reason || "No reason provided"}</p>
                  </div>
{/* passed time */}
                  {appointment.status === "pending" ? (() => {
                    console.log("Raw appointment.date:", appointment.date);
                    console.log("Raw appointment.time:", appointment.time);

                    const [year, month, day] = appointment.date.split("-");

                    let hour = 0;
                    let minute = 0;

                    // Handle "07:00 AM" or "02:30 PM"
                    const timeMatch = appointment.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
                    if (timeMatch) {
                      let [, hr, min, meridian] = timeMatch;
                      hr = parseInt(hr);
                      min = parseInt(min);

                      if (meridian.toUpperCase() === "PM" && hr !== 12) hr += 12;
                      if (meridian.toUpperCase() === "AM" && hr === 12) hr = 0;

                      hour = hr;
                      minute = min;
                    }

                    // Construct valid local Date object
                    const appointmentDateTime = new Date(
                      Number(year),
                      Number(month) - 1,
                      Number(day),
                      hour,
                      minute
                    );

                    const now = new Date();

                    console.log("Parsed Appointment DateTime:", appointmentDateTime.toString());
                    console.log("Current Time:", now.toString());


                    if (now.getTime() < appointmentDateTime.getTime()) {
                      return (
                        <div className="appointment-actions">
                          <button
                            onClick={() =>
                              setAppointmentToUpdate({ id: appointment._id, status: "confirmed" })
                            }
                            className="accept-button"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              setAppointmentToUpdate({ id: appointment._id, status: "rejected" })
                            }
                            className="reject-button"
                          >
                            Reject
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <p className="expired-message">This appointment time has already passed.</p>
                      );
                    }
                  })() : (
                    //
                    <div className="appointment-status">
                      <p className={`status-message ${appointment.status}`}>
                        {appointment.status === "confirmed"
                          ? "Appointment accepted"
                          : appointment.status === "rejected"
                          ? "Appointment rejected"
                          : appointment.status === "canceled"
                          ? "Appointment canceled by patient"
                          : "Status: " + appointment.status}
                      </p>
                      {appointment.notes && (
                        <div className="appointment-notes">
                          <label>Your notes:</label>
                          <p>{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FooterDoc />
    </>
  );
};

export default DoctorAppointmentsList;
