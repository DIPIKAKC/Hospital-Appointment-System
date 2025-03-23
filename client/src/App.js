import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//system imports
 import LoginForm from "./System/Login";
 import Register from "./System/Register";
 import { Dashboard } from "./System/User/Dashboard";

const App = () => {

  return (
    <Router>

      {/* //<NavBar/>  */}
      {/* NavBar should be outside Routes to show on all pages */}

      <Routes>
          <Route path = "/login" element={<LoginForm />} />
          <Route path = "/register" element={<Register />} />
          <Route path= "/" element ={<Dashboard/>} /> 
          
      </Routes>
    </Router>
  );

}

export default App;
