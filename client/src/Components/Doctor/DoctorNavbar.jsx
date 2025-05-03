import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate} from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";
import { RiUser3Line, RiLockPasswordLine, RiLogoutBoxLine } from "react-icons/ri";

import './DoctorNavbar.css';
import userImg from '../../assets/user.jpg'

const DocBar = () => {

    const [username, setUsername] = useState ("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const handledocLogout = () => {
        console.log("Logout clicked");

        // Clear local storage
        localStorage.clear();
        navigate ("/")
        // Update state
        setIsLoggedIn(false);
        setUsername("");
        setShowDropdown(false); // Optional
    };

    return(

        <nav className="doc-navbar">

            <div className="doc-navcontainer">
                    {/* <button className="logo">
                        <Link to= "/" > MedEase</Link>
                    </button> */}

                    <Link to="/doc-dashboard" className="logo">
                        MedEase
                    </Link>

                    <div className="doc-navbar-menu">
                        <NavLink to="/doc-dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/schedules" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                            Manage Schedule
                        </NavLink>

                        <NavLink to="/my-assigned-appointments" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                            My Assigned Appointments
                        </NavLink>

                        <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                            Contact Us
                        </NavLink>
                    </div>

                    <div className="doc-nav-actions">
                    {isLoggedIn ? (
                        <>
                            <NavLink to="/my-notifications" className="doc-notification-icon">
                                <HiOutlineBell size={22} />
                            </NavLink>

                            <div className="doc-profile-section" ref={dropdownRef}>
                                <div 
                                    className="doc-profile-trigger" 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img className='doc-photo' src={userImg} alt={username} />
                                        <span className="docname">{username}</span>
                                            <MdOutlineArrowDropDown 
                                                size={20} 
                                                className={`doc-dropdown-arrow ${showDropdown ? 'active' : ''}`} 
                                            />
                                </div>
                            </div>

                                {showDropdown && (
                                    <div className="doc-dropdown-menu">
                                        <Link to="/profile-doc" className="doc-dropdown-item">
                                            <RiUser3Line size={18} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link to="/change-password" className="doc-dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <RiLockPasswordLine size={18} />
                                            <span>Change Password</span>
                                        </Link>
                                        <div className="doc-dropdown-divider"></div>
                                        <button className="doc-dropdown-item logout" onMouseDown={handledocLogout}>
                                            <RiLogoutBoxLine size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                        </>
                    ) : (
                        <div className="doc-auth-buttons">
                            <Link to='/signup'>
                                <button className="btn btn-outline">Create Account</button>
                            </Link>
                            <Link to="/login">
                                <button className="btn btn-primary">Login</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    );
}; 

export default DocBar;
