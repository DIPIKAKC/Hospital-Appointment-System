import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
import NavBar from "./Components/Navbar";
import HomePage from "./System/User/HomePage";
import AppointmentBooking from "./System/User/AppointmentBooking";
import LoginForm from "./System/User/LoginForm";


const App = () => {

  return (
    <Router>

      <NavBar/> {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
          <Route path = "/login" element={<LoginForm />} />
          <Route path= "/Home" element ={<HomePage/>} /> 
          <Route path= "/appointment-book" element = {<AppointmentBooking/>} />
          
      </Routes>
    </Router>
  );

}

export default App;
