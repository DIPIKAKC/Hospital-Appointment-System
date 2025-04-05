import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
 import NavBar from "./Components/Navbar";
import Resources from "./Components/Resources";
import Footer from "./Components/Footer";
import FindDoctors from "./Pages/User/FindDoctors";
import DoctorPage from "./Pages/User/DoctorPage"
import LoginForm from "./Pages/User/Login";

const App = () => {

  return (
    <Router>

      <NavBar/> 
      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
          <Route path = "/" element={<Footer />} />
          <Route path = "/login" element={<LoginForm />} />
          <Route path="/getAllDoctors" element={<FindDoctors />} />
          <Route path= "/doctor/:doctorId" element={<DoctorPage />} />

          
      </Routes>

      <Resources / >

    </Router>
  );

}

export default App;
