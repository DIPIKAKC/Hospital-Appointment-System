import React, { useEffect, useState } from 'react';
import { GoSearch } from "react-icons/go";

import './FindDoctors.css';
import DoctorCard from '../../Components/User/DoctorCard';
import NavBar from "../../Components/User/Navbar";
import Resources from "../../Components/User/Resources";
import Footer from "../../Components/User/Footer";

const FindDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [displayedDoctors, setDisplayedDoctors] = useState([]);

    // Fetch all doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/all-doctors");
                const data = await response.json();
                console.log("doctor data", data.data)
                if(data.success){
                    setDoctors(data.data)
                    setDisplayedDoctors(data.data); 
                }
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/departments");
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setDepartments(data);
                }
            } catch (error) {
                console.error("Error fetching department data:", error);
            }
        };
        
        fetchDepartments();
    }, []);

    
    // update displayed doctors when filters change
    useEffect(() => {
        if (selectedDepartment || searchTerm) {
            console.log("Filtering with:", selectedDepartment, searchTerm);
            const filtered = doctors.filter(doctor => {
                // department filter
                const matchesDepartment = selectedDepartment ? 
                (doctor.department?.name?.toLowerCase().trim() === selectedDepartment.toLowerCase().trim()) : true;              
                          
                // Search filter -case insensitive
                const matchesSearch = searchTerm ? 
                (doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) : true;
                
                return matchesDepartment && matchesSearch;
            });
            setDisplayedDoctors(filtered);
        } else {
            // show all doctors
            setDisplayedDoctors(doctors);
        }
    }, [selectedDepartment, searchTerm, doctors]);

    // handle department selection
    const handleDepartmentClick = (department) => {
        setSelectedDepartment(department === selectedDepartment ? null : department);
    };

    // handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // clear all filters
    const clearFilters = () => {
        setSelectedDepartment(null);
        setSearchTerm('');
    };

    return (
        <>
        <NavBar/> 

        <main className="find-doctor-container">
{/*  */}
            <div className="find-doctor-sidebar">
                <div className="find-doctor-dept-container">
                    <h2>Departments</h2>
                    <p className="find-doctor-dept-subtitle">Find by speciality</p>
                    
                    <div className="find-doctor-dept-list scrollable-dept-list">
                        {departments.length > 0 ? (
                            departments.map((department, index) => (
                                <div 
                                    key={index}
                                    className={`dept-item ${selectedDepartment === department.name ? 'active' : ''}`}
                                    onClick={() => handleDepartmentClick(department.name)}
                                >
                                    {department.name}
                                </div>
                            ))
                        ) : (
                            <div className="find-doctor-dept-item">Loading departments...</div>
                        )}
                    </div>
                    
                    {(selectedDepartment || searchTerm) && (
                        <button 
                            className="find-doctor-btn-show-all"
                            onClick={clearFilters}
                        >
                            Show All
                        </button>
                    )}
                </div>
            </div>

{/*  */}
            <div className="find-doctor-content">
                <div className="find-doctor-search-wrapper">
                    <i className="find-doctor-search-icon"><GoSearch size={22}/></i>
                    <input 
                        type="text" 
                        placeholder="Search by name" 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>


                <div className="find-doctor-doctor-grid">
                    {loading ? (
                        <p>Loading doctors...</p>
                    ) : displayedDoctors.length > 0 ? (
                        displayedDoctors.map((doctor) => (
                            <DoctorCard key={doctor._id} doctor={doctor} />
                        ))
                    ) : (
                        <p>No Doctors Available</p>
                    )}
                </div>
            </div>
        </main>

        <Resources />
        <Footer />
        </>
    );
};

export default FindDoctors;