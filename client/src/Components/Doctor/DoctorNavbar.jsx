import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate} from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";

import './DoctorNavbar.css';
import userImg from '../../assets/user.jpg'

const DocBar = () => {

    const [username, setUsername] = useState ("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        
        // Check if user is logged in
        if (userId && token) {
            setIsLoggedIn(true);
            fetchUserData(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }, 
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            setUsername(data.fullName);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem("id");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        // Update state
        setIsLoggedIn(false);
        setUsername("");
        
        // Redirect to login page or home
        navigate("/");
    };

    return(

        <nav className="nav-bar">

            <div className="Nav-container">
                    {/* <button className="logo">
                        <Link to= "/" > MedEase</Link>
                    </button> */}

                    <Link to="/dashboard">
                        <button className="logo">MedEase</button>
                    </Link>

                    <div className="navbar-menu">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Manage Schedule
                    </NavLink>

                    <NavLink to="/my-assigned-appointments" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        My Assigned Appointments
                    </NavLink>

                    <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Contact Us
                    </NavLink>

                    </div>

                    <div className="divider"></div>

                    <div className="nav-actions">
                    {isLoggedIn ? (
                        <>
                            <NavLink to="/my-notifications">
                                <HiOutlineBell size={22} />
                            </NavLink>

                            <div className="user-profile">
                                <img className='user-photo' src={userImg} alt="User" />
                                {username && (
                                    <div className="username">
                                        Welcome, Dr. {username.split(" ")[0]}
                                    </div>
                                )}                               
                                <button className="logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">

                            <Link to='/signup'>
                            <button className="create-account-btn">Create Account</button>
                            </Link>
                            <Link to ="/login">
                            <button className="login-btn">Login</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    );
}; 

export default DocBar;
