import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate} from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";

import './Navbar.css';
import userImg from '../../assets/user.jpg'

const NavBar = () => {

    const [username, setUsername] = useState ("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("id");
        const username= localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        // Check if user is logged in
        if (userId && token) {
            setIsLoggedIn(true);
            fetchUserData(userId, token, username);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = async (userId, token) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/get-user-by-id/${userId}`, {
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
            setUsername(data.data.fullName);
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

                    <Link to="/">
                        <button className="logo">MedEase</button>
                    </Link>

                    <div className="navbar-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Home
                    </NavLink>

                    <NavLink to="/appointments" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Appointments
                    </NavLink>

                    <NavLink to="/find-doctors" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Find Doctors
                    </NavLink>

                    <NavLink to="/contact-us" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                        Contact Us
                    </NavLink>

                    </div>

                    <div className="divider"></div>


                    {/* <div className="nav-actions">
                        <NavLink to="/notification" >
                             <HiOutlineBell size={22}/>
                        </NavLink>

                    <div className="user-profile">
                        <img className='user-photo' src={userImg} alt="User"></img>
                        <div className="username">
                            {username ? `Welcome, ${username}` : `Welcome, Guest`}
                        </div>
                        <MdOutlineArrowDropDown size={22}/>
                    </div>                    
                    </div> */}
                    <div className="nav-actions">
                    {isLoggedIn ? (
                        <>
                            <NavLink to="/notification">
                                <HiOutlineBell size={22} />
                            </NavLink>

                            <div className="user-profile">
                                <img className='user-photo' src={userImg} alt="User" />
                                <div className="username">
                                    Welcome, {username}
                                </div>
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

export default NavBar;
