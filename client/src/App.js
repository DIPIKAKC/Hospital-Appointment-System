import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
 import NavBar from "./Components/Navbar";
 import DoctorProfileCard from "./Components/DoctorProfile";
import Resources from "./Components/Resources";
import Footer from "./Components/Footer";
import FindDoctors from "./Pages/User/FindDoctors";

const App = () => {

  return (
    <Router>

      <NavBar/> 
      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
          <Route path = "/" element={<Footer />} />
          <Route path = "/b" element={<DoctorProfileCard />} />
          <Route path="/getAllDoctors" element={<FindDoctors />} />

          
      </Routes>

      <Resources / >

    </Router>
  );

}

export default App;
