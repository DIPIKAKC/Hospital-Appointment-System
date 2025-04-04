 import React, { useEffect, useState } from 'react';
 import { GoSearch } from "react-icons/go";

import './FindDoctors.css';
import DoctorCard from '../../Components/DoctorCard';

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
                
                if (Array.isArray(data)) {
                    setDoctors(data);
                    setDisplayedDoctors(data); // Initially show all doctors
                }
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDoctors();
    }, []);

    // Fetch departments from separate database
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

    // Update displayed doctors when filters change
    useEffect(() => {
        if (selectedDepartment || searchTerm) {
            const filtered = doctors.filter(doctor => {
                // Department filter
                const matchesDepartment = selectedDepartment ? doctor.department === selectedDepartment : true;
                
                // Search filter (case insensitive)
                const matchesSearch = searchTerm ? doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                
                return matchesDepartment && matchesSearch;
            });
            setDisplayedDoctors(filtered);
        } else {
            // If no filters are applied, show all doctors
            setDisplayedDoctors(doctors);
        }
    }, [selectedDepartment, searchTerm, doctors]);

    // Handle department selection
    const handleDepartmentClick = (department) => {
        setSelectedDepartment(department === selectedDepartment ? null : department);
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedDepartment(null);
        setSearchTerm('');
    };

    return (
        <main className="main-content">
            <div className="sidebar">
                <div className="departments-section">
                    <h2>Departments</h2>
                    <p className="find-text">Find by speciality</p>
                    
                    <div className="department-list">
                        {departments.length > 0 ? (
                            departments.map((department, index) => (
                                <div 
                                    key={index}
                                    className={`department-item ${selectedDepartment === department.name ? 'active' : ''}`}
                                    onClick={() => handleDepartmentClick(department.name)}
                                >
                                    {department.name}
                                </div>
                            ))
                        ) : (
                            <div className="department-item">Loading departments...</div>
                        )}
                    </div>
                    
                    {(selectedDepartment || searchTerm) && (
                        <button 
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        >
                            Show All
                        </button>
                    )}
                </div>
            </div>

            <div className="content-area">
                <div className="search-bar">
                    <i className="search-icon"><GoSearch size={22}/></i>
                    <input 
                        type="text" 
                        placeholder="Search by name" 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className='doctors-card-container'>
                    {loading ? (
                        <p>Loading doctors...</p>
                    ) : displayedDoctors.length > 0 ? (
                        displayedDoctors.map((doctor) => (
                            <DoctorCard key={doctor._id} doctors={doctor} />
                        ))
                    ) : (
                        <p>No Doctors Available</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default FindDoctors;