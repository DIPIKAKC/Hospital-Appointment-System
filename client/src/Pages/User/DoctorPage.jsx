import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './DoctorPage.css';
import DoctorProfileCard from "../../Components/DoctorProfile";
import { useParams } from "react-router-dom";


const DoctorPage = () => {

    const {doctorId} = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [reason, setReason] = useState("");
    const navigate= useNavigate()

    //time-slots doctor
    useEffect(() => {
        const fetchAppointmentTime = async() =>{

            const token= localStorage.getItem("token")
            try{
                const response = await fetch(`http://localhost:5000/auth/${doctorId}/available-slots`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization : `Bearer ${token}`
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error("Failed to fetch available slots");
                }

                const data = await response.json();
                setDoctors(data);

            // Format backend date to match selectedDate
            const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
            
            // Find the doctor with ID matching doctorId
            const currentDoctor = data.find(doctor => doctor._id === doctorId);
            
            if (!currentDoctor || !currentDoctor.availableSlots) {
                console.error("Doctor not found or has no available slots:", doctorId);
                setAvailableTimes([]);
                return;
            }

            // Find slots for the selected date
            const slotsForDate = currentDoctor.availableSlots.find(slot => 
                slot.date === formattedSelectedDate
            );

            console.log("Slots for Selected Date:", slotsForDate); // Debugging log
            
            setAvailableTimes(slotsForDate ? slotsForDate.times : []);
        } catch (error) {
            console.error("Error fetching available slots:", error);
            setAvailableTimes([]);
        }}
        
        fetchAppointmentTime();
    },[doctorId, selectedDate]); // Re-fetch when date changes

    //book-appointment
        const handleBookAppointment = async () => {

            if (!selectedTime) {
                alert("Please select a time slot");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to book an appointment");
                return;
            }
            
            try {

                // Log the data being sent
                const appointmentData = {
                    doctorId,
                    date: selectedDate.toISOString().split("T")[0],
                    time: selectedTime,
                    reason: reason
                };
                console.log("Booking appointment with data:", appointmentData);

                const response = await fetch(`http://localhost:5000/auth/book-appointment`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(appointmentData)
                });
                
                if (!response.ok) {
                    throw new Error("Failed to book appointment");
                }
                
                const data = await response.json();
                alert("Appointment request sent successfully. Waiting for response");
                setTimeout(() => navigate("/appointments"), 2000);
                // Reset selected time or redirect to confirmation page
            } catch (error) {
                console.error("Error booking appointment:", error);
                alert("Failed to book appointment. Please try again.");
            }
        };

        const handleLogout = () => {
            localStorage.removeItem("token");
            // redirect to login or homepage
            navigate("/login");
          };
          


    return(
        <div className="main-container">

            <div className="doctor">
                <aside className="info-card">
                    <DoctorProfileCard />
                </aside>
            </div>

            <div className="booking-section">

                <div className="calendar">
                    <h3>Select Appointment Date</h3>
                    <Calendar 
                        className="appointment-calendar"
                        onChange={setSelectedDate}
                        value={selectedDate}
                        minDate={new Date()}
                    />           

                </div>
                <div className="timeslot-section>">
                    <h3> Available Hours</h3>

                    {availableTimes.length > 0 ? (
                        <div className="time-grid">
                            {availableTimes.map((time, index) => (
                                <button
                                    key={index}
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p>No available slots for this date.</p>
                    )}

                </div>
                
                <input type="text"
                 placeholder="your reason"
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
                 >
                
                </input>

                <button 
                    className="continue-button"
                    onClick={handleBookAppointment}
                    disabled={!selectedTime}
                >
                    
                    Book Appointment
                </button>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>

        </div>

    )
};

export default DoctorPage;