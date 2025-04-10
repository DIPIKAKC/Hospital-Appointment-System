import React from "react";

import NavBar from "../../Components/User/Navbar";
import Resources from "../../Components/User/Resources";
import Footer from "../../Components/User/Footer";
import DashboardComponent from "../../Components/User/Dashboard";

const Home = () => {
    return (
        <>
            <NavBar />
            <DashboardComponent/>
        
            <Resources />
            <Footer />
        </>
    )
}

export default Home;