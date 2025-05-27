import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";
import { RiUser3Line, RiLockPasswordLine, RiLogoutBoxLine } from "react-icons/ri";
import './Navbar.css';

const NavBar = () => {
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [profileImage, setProfileImage]=useState()
    const [unreadCount, setUnreadCount] = useState(0);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("id");
        const username = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userId && token) {
            setIsLoggedIn(true);
            fetchUserData(userId, token, username);
            fetchUnreadNotifications();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const token = localStorage.getItem("token")

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/auth/me-user`, {
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

            if (data.data.profile) {
                setProfileImage(data.data.profile);  
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchUnreadNotifications = async () => {
        const userId = localStorage.getItem("id");
        const userType = "patient"; // or determine dynamically if needed

        try {
            const response = await fetch(`http://localhost:5000/auth/my-notification/${userType}/${userId}`);
            const data = await response.json();
            if (data.success) {
            const unread = data.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
        };


    const handleLogout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUsername("");
        navigate("/");
    };

    // const handleProfile = () =>{
    //     navigate('/my-profile');
    // }

    return (
        <nav className="nav-bar">
            <div className="nav-container">
                <Link to="/" className="logo">
                    MedEase
                </Link>

                <div className="user-navbar-menu">
                    <NavLink to="/" className={({ isActive }) => `user-nav-item ${isActive ? "active" : ""}`}>
                        Home
                    </NavLink>
                    <NavLink to="/appointments" className={({ isActive }) => `user-nav-item ${isActive ? "active" : ""}`}>
                        Appointments
                    </NavLink>
                    <NavLink to="/find-doctors" className={({ isActive }) => `user-nav-item ${isActive ? "active" : ""}`}>
                        Find Doctors
                    </NavLink>
                    <NavLink to="/contact-us" className={({ isActive }) => `user-nav-item ${isActive ? "active" : ""}`}>
                        Contact Us
                    </NavLink>
                </div>

                <div className="nav-actions">
                    {isLoggedIn ? (
                        <>
                            <div className="user-notification-bell">
                            <NavLink to="/notification" className="user-notification-icon">
                                <HiOutlineBell size={22} />
                                {/* {unreadCount > 0 && (
                                <span className="user-notification-count">{unreadCount}</span>
                                )} */}
                            </NavLink>
                            </div>


                            <div className="user-profile-section" ref={dropdownRef}>
                                <div 
                                    className="profile-trigger" 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img className='user-photo' src={profileImage} alt={username} />
                                    <span className="username">{username}</span>
                                    <MdOutlineArrowDropDown 
                                        size={20} 
                                        className={`dropdown-arrow ${showDropdown ? 'active' : ''}`} 
                                    />
                            </div>

                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <Link to="/my-profile" className="dropdown-item">
                                            <RiUser3Line size={18} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link to="/change-password" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <RiLockPasswordLine size={18} />
                                            <span>Change Password</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            <RiLogoutBoxLine size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="authbuttons">
                            <Link to='/signup'>
                                <button className="btn btn-primary">Create Account</button>
                            </Link>
                            <Link to="/login">
                                <button className="btn btn-outline">Login</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;