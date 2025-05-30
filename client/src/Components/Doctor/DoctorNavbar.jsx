// import React, { useEffect, useState, useRef } from "react";
// import { Link, NavLink, useNavigate} from "react-router-dom";
// import { MdOutlineArrowDropDown } from "react-icons/md";
// import { HiOutlineBell } from "react-icons/hi2";
// import { RiUser3Line, RiLockPasswordLine, RiLogoutBoxLine } from "react-icons/ri";

// import './DoctorNavbar.css';
// import userImg from '../../assets/user.jpg'

// const DocBar = () => {

//     const [username, setUsername] = useState ("");
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [profileImage, setProfileImage]=useState()
//     const [unreadCount, setUnreadCount] = useState(0);

//     const dropdownRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const userId = localStorage.getItem("id");
//         const token = localStorage.getItem("token");
//         // Check if user is logged in
//         if (userId && token) {
//             setIsLoggedIn(true);
//             fetchUserData(token);
//             fetchUnreadNotifications();
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);


//     const fetchUserData = async (token) => {
//         try {
//             const response = await fetch(`http://localhost:5000/auth/me`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     "Authorization": `Bearer ${token}`
//                 }, 
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch user data");
//             }

//             const data = await response.json();
//             setUsername(data.fullName);

//             if (data.profile && data.profile !== "") {
//                 setProfileImage(data.profile);  
//             }

//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     };



//     const fetchUnreadNotifications = async () => {
//         const userId = localStorage.getItem("id");
//         const userType = "doctor"; 

//         try {
//             const response = await fetch(`http://localhost:5000/auth/my-notification/${userType}/${userId}`);
//             const data = await response.json();
//             if (data.success) {
//             const unread = data.data.filter(n => !n.isRead).length;
//             setUnreadCount(unread);
//             }
//         } catch (error) {
//             console.error("Error fetching notifications:", error);
//         }
//     };

//     const handledocLogout = () => {
//         console.log("Logout clicked");

//         // Clear local storage
//         localStorage.clear();
//         navigate ("/")
//         // Update state
//         setIsLoggedIn(false);
//         setUsername("");
//         setShowDropdown(false); // Optional
//     };

//     return(

//         <nav className="doc-navbar">

//             <div className="doc-navcontainer">
//                     {/* <button className="logo">
//                         <Link to= "/" > MedEase</Link>
//                     </button> */}

//                     <Link to="/doc-dashboard" className="logo">
//                         MedEase
//                     </Link>

//                     <div className="doc-navbar-menu">
//                         <NavLink to="/doc-dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
//                             Dashboard
//                         </NavLink>

//                         <NavLink to="/schedules" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
//                             Manage Schedule
//                         </NavLink>

//                         <NavLink to="/my-assigned-appointments" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
//                             My Assigned Appointments
//                         </NavLink>

//                         <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
//                             Contact Us
//                         </NavLink>
//                     </div>

//                     <div className="doc-nav-actions">
//                     {isLoggedIn ? (
//                         <>
//                             <div className="notification-bell">
//                             <NavLink to="/my-notifications" className="notification-icon">
//                                 <HiOutlineBell size={22} />
//                                 {unreadCount > 0 && (
//                                 <span className="notification-count">{unreadCount}</span>
//                                 )}
//                             </NavLink>
//                             </div>

//                             <div className="doc-profile-section" ref={dropdownRef}>
//                                 <div 
//                                     className="doc-profile-trigger" 
//                                     onClick={() => setShowDropdown(!showDropdown)}
//                                 >
//                                     <img className='doc-photo' src={profileImage} alt={username} />
//                                         <span className="docname">{username}</span>
//                                             <MdOutlineArrowDropDown 
//                                                 size={20} 
//                                                 className={`doc-dropdown-arrow ${showDropdown ? 'active' : ''}`} 
//                                             />
//                                 </div>

//                                 {showDropdown && (
//                                     <div className="doc-dropdown-menu">
//                                         <Link to="/profile-doc" className="doc-dropdown-item">
//                                             <RiUser3Line size={18} />
//                                             <span>My Profile</span>
//                                         </Link>
//                                         <Link to="/change-pw-doc" className="doc-dropdown-item" onClick={() => setShowDropdown(false)}>
//                                             <RiLockPasswordLine size={18} />
//                                             <span>Change Password</span>
//                                         </Link>
//                                         <div className="doc-dropdown-divider"></div>
//                                         <button className="doc-dropdown-item logout" onClick={handledocLogout}>
//                                             <RiLogoutBoxLine size={18} />
//                                             <span>Logout</span>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </>
//                     ) : (
//                         <div className="doc-auth-buttons">
//                             <Link to='/signup'>
//                                 <button className="btn btn-outline">Create Account</button>
//                             </Link>
//                             <Link to="/login">
//                                 <button className="btn btn-primary">Login</button>
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>

//         </nav>
//     );
// }; 

// export default DocBar;



import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate} from "react-router-dom";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiOutlineBell } from "react-icons/hi2";
import { RiUser3Line, RiLockPasswordLine, RiLogoutBoxLine, RiMenu3Line, RiCloseLine } from "react-icons/ri";

import './DoctorNavbar.css';

const DocBar = () => {

    const [username, setUsername] = useState ("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [profileImage, setProfileImage]=useState()
    const [unreadCount, setUnreadCount] = useState(0);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        // Check if user is logged in
        if (userId && token) {
            setIsLoggedIn(true);
            fetchUserData(token);
            fetchUnreadNotifications();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu when window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setShowMobileMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

            if (data.profile && data.profile !== "") {
                setProfileImage(data.profile);  
            }

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchUnreadNotifications = async () => {
        const userId = localStorage.getItem("id");
        const userType = "doctor"; 

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

    const handledocLogout = () => {
        console.log("Logout clicked");

        // Clear local storage
        localStorage.clear();
        navigate ("/")
        // Update state
        setIsLoggedIn(false);
        setUsername("");
        setShowDropdown(false);
        setShowMobileMenu(false);
    };

    const handleMobileNavClick = () => {
        setShowMobileMenu(false);
    };

    return(
        <nav className="doc-navbar">
            <div className="doc-navcontainer">
                <Link to="/doc-dashboard" className="logo">
                    MedEase
                </Link>

                {/* Desktop Menu */}
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

                {/* Desktop Actions */}
                <div className="doc-nav-actions">
                    {isLoggedIn ? (
                        <>
                            <div className="doc-notification-bell">
                                <NavLink to="/my-notifications" className="doc-notification-icon">
                                    <HiOutlineBell size={22} />
                                    {unreadCount > 0 && (
                                        <span className="doc-notification-count">{unreadCount}</span>
                                    )}
                                </NavLink>
                            </div>

                            <div className="doc-profile-section" ref={dropdownRef}>
                                <div 
                                    className="doc-profile-trigger" 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img className='doc-photo' src={profileImage} alt={username} />
                                    <span className="docname">{username}</span>
                                    <MdOutlineArrowDropDown 
                                        size={20} 
                                        className={`doc-dropdown-arrow ${showDropdown ? 'active' : ''}`} 
                                    />
                                </div>

                                {showDropdown && (
                                    <div className="doc-dropdown-menu">
                                        <Link to="/profile-doc" className="doc-dropdown-item">
                                            <RiUser3Line size={18} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link to="/change-pw-doc" className="doc-dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <RiLockPasswordLine size={18} />
                                            <span>Change Password</span>
                                        </Link>
                                        <div className="doc-dropdown-divider"></div>
                                        <button className="doc-dropdown-item logout" onClick={handledocLogout}>
                                            <RiLogoutBoxLine size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
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

                    {/* Mobile Hamburger Button */}
                    <button 
                        className="mobile-menu-toggle"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        aria-label="Toggle mobile menu"
                    >
                        {showMobileMenu ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
                    <div className="mobile-menu" ref={mobileMenuRef} onClick={(e) => e.stopPropagation()}>
                        {/* Mobile Profile Section */}
                        {isLoggedIn && (
                            <div className="mobile-profile-section">
                                <img className='mobile-profile-photo' src={profileImage} alt={username} />
                                <div className="mobile-profile-info">
                                    <span className="mobile-username">{username}</span>
                                    <div className="mobile-notification-info">
                                        <HiOutlineBell size={16} />
                                        <span>{unreadCount} notifications</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Navigation Links */}
                        <div className="mobile-nav-links">
                            <NavLink 
                                to="/doc-dashboard" 
                                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                                onClick={handleMobileNavClick}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink 
                                to="/schedules" 
                                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                                onClick={handleMobileNavClick}
                            >
                                Manage Schedule
                            </NavLink>

                            <NavLink 
                                to="/my-assigned-appointments" 
                                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                                onClick={handleMobileNavClick}
                            >
                                My Assigned Appointments
                            </NavLink>

                            <NavLink 
                                to="/contact" 
                                className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                                onClick={handleMobileNavClick}
                            >
                                Contact Us
                            </NavLink>

                            {isLoggedIn && (
                                <>
                                    <div className="mobile-divider"></div>
                                    
                                    <NavLink 
                                        to="/my-notifications" 
                                        className="mobile-nav-item"
                                        onClick={handleMobileNavClick}
                                    >
                                        <HiOutlineBell size={18} />
                                        <span>Notifications</span>
                                        {unreadCount > 0 && (
                                            <span className="mobile-notification-badge">{unreadCount}</span>
                                        )}
                                    </NavLink>

                                    <NavLink 
                                        to="/profile-doc" 
                                        className="mobile-nav-item"
                                        onClick={handleMobileNavClick}
                                    >
                                        <RiUser3Line size={18} />
                                        <span>My Profile</span>
                                    </NavLink>

                                    <NavLink 
                                        to="/change-pw-doc" 
                                        className="mobile-nav-item"
                                        onClick={handleMobileNavClick}
                                    >
                                        <RiLockPasswordLine size={18} />
                                        <span>Change Password</span>
                                    </NavLink>

                                    <button 
                                        className="mobile-nav-item logout-btn" 
                                        onClick={handledocLogout}
                                    >
                                        <RiLogoutBoxLine size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Auth Buttons */}
                        {!isLoggedIn && (
                            <div className="mobile-auth-buttons">
                                <Link to='/signup' onClick={handleMobileNavClick}>
                                    <button className="btn btn-outline mobile-btn">Create Account</button>
                                </Link>
                                <Link to="/login" onClick={handleMobileNavClick}>
                                    <button className="btn btn-primary mobile-btn">Login</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}; 

export default DocBar;