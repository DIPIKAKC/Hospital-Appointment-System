import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './DoctorPage.css';
import DoctorProfileCard from "../../Components/DoctorProfile";
import { useParams } from "react-router-dom";
import NavBar from '../../Components/Navbar';
import Resources from "../../Components/Resources";
import Footer from "../../Components/Footer";


const DoctorPage = () => {

    const {doctorId} = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [reason, setReason] = useState("");
    const navigate= useNavigate()

    // Function to format dates consistently
    const formatDate = (date) => {

        const d = new Date(date);
        // return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };


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

            // Format selectedDate consistently
            const formattedSelectedDate = formatDate(selectedDate);
            console.log("Looking for slots on date:", formattedSelectedDate);          
                        
            // Find the doctor with ID matching doctorId
            const currentDoctor = data.find(doctor => doctor._id === doctorId);

            if (!currentDoctor || !currentDoctor.availableSlots) {
                console.error("Doctor not found or has no available slots:", doctorId);
                setAvailableTimes([]);
                return;
            }

//
            console.log("All available slot dates:", 
                currentDoctor.availableSlots.map(slot => ({
                    original: slot.date,
                    formatted: formatDate(new Date(slot.date))
                }))
            );
//

            // Find slots for the selected date
            const slotsForDate = currentDoctor.availableSlots.find(slot => {
                const slotDate = formatDate(new Date(slot.date));
                return slotDate === formattedSelectedDate;
            });         

            console.log("Slots for Selected Date:", slotsForDate); // Debugging log
            
            if (slotsForDate && slotsForDate.times) {
                console.log("Available times:", slotsForDate.times);
                setAvailableTimes(slotsForDate.times);
            } else {
                console.log("No times available for selected date");
                setAvailableTimes([]);
            }

        } catch (error) {
            console.error("Error fetching available slots:", error);
            setAvailableTimes([]);
        }}
        
        fetchAppointmentTime();
    },[doctorId, selectedDate]); // Re-fetch when date changes


    // Handle date change
    const handleDateChange = (date) => {
        console.log("Date changed to:", date, "Formatted:", formatDate(date));
        setSelectedDate(date);
        setSelectedTime(null); // Reset selected time when date changes
    };

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
                    date: formatDate(selectedDate),
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
                    const errorData = await response.json();
                    throw new Error("Failed to book appointment",errorData);
                }
                
                const data = await response.json();
                alert("Appointment request sent successfully. Waiting for response",data);
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

        <>
        <NavBar />
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
                        onChange={handleDateChange}
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
                
                <div className="reason-input">
                    <h3>Appointment Reason</h3>
                    <input 
                        type="text"
                        placeholder="Reason for appointment"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <button className="continue-button"
                    onClick={handleBookAppointment}
                    disabled={!selectedTime}
                >
                    
                    Book Appointment
                </button>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>

        </div>
        <Resources />
        <Footer />
    </>
    )
};

export default DoctorPage;