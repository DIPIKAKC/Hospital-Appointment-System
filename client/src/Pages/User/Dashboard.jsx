import React from "react";
import './Dashboard.css';
import aboutImg from '../../assets/about3.jpg';

import DoctorProfileCard from "../../Components/DoctorProfile";
import NavBar from '../../Components/Navbar';
import Resources from '../../Components/Resources';
import Footer from '../../Components/Footer';
import DashboardComponent from "../../Components/Dashboard";

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