import React, { useState, useEffect } from "react";



const FormAppointment = ({ selectedDate, selectedTimeSlot, onSubmit, onClose }) => {

    const [appointment, setAppointment] = useState({
      // patientName: "",
      // doctor: doctor,
      // department: "",
      appointmentDate: selectedDate,
      time: selectedTimeSlot,
      // paymentDetail: paymentDetail,
    });

  const [doctor, setDoctor] = useState([]);
  // const [departments, setDepartments] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fetch the patient's details
    const fetchPatientDetails = async () => {
      const  id = localStorage.getItem("userId")
      try {
        const response = await fetch(`http://localhost:4000/auth/get-user-data-by-id/${id}`); 
        console.log(response);
        const data = await response.json();
        setUserName(data.name.name);

      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    // // Fetch departments
    // const fetchDepartments = async () => {
    //   const id= localStorage.getItem("departmentId")
    //   try {
    //     const response = await fetch(`http://localhost:4000/auth/${id}`);
    //     const data = await response.json();
    //     setDepartments(data.name.name);
    //   } catch (error) {
    //     console.error("Error fetching departments:", error);
    //   }
    // };

    const fetchDoctors = async () => {
      const  id = localStorage.getItem("doctorId")
      try {
        const response = await fetch(`http://localhost:4000/auth/get-doctor-data-by-id/${id}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchPatientDetails();
    // fetchDepartments();
    fetchDoctors();

  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/auth/appointment-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });

      const data = await response.json();

      if (response.ok) {
        onSubmit(data);
        alert("Appointment booked successfully!");
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment.");
    }
  };

  return (
    <div className="modal">
      <div className="form-container">
        <h2>Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient’s Name</label>
            <input
              type="text"
              name="patientName"
              value={userName}
              disabled
            />
          </div>
          {/* <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={appointment.dob}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={appointment.age}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Contact Detail</label>
            <input
              type="text"
              name="contact"
              value={appointment.contact}
              disabled
            />
          </div> */}

          <div className="form-group">
            <label>Doctor name</label>
            <select
              name="department"
              value={doctor.fullName}
              disabled
            >
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={doctor.department}
              disabled
            >
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={appointment.appointmentDate}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={appointment.time}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Payment Detail</label>
            <input
              type="text"
              name="paymentDetail"
              value={appointment.paymentDetail}
              disabled
            />
          </div>
          <button type="submit" className="submit-btn">Book Appointment</button>
          <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default FormAppointment;



//before dob and so on