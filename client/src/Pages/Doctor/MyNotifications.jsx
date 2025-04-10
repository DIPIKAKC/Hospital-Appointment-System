import React, { useState, useEffect } from 'react';
import { FaBell, FaCalendarAlt, FaUser, FaExclamationCircle, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { GiConfirmed } from "react-icons/gi";
import '../User/Notification.css';


const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const userId = localStorage.getItem('id')
  const userType = 'doctor'



    // Simulated API response
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/my-notification/${userType}/${userId}`,{
            method:"GET"
        })
        const data = await response.json()

        console.log("noti" , data)
        if(data.success){
            setNotifications(data.data)
        }else{
            console.log("Notification not found")
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    useEffect(()=>{
        fetchNotifications()
    },[])

    

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification._id === id ? { ...notification, isRead: true } : notification
    ));
    
    // In a real app, update backend
    // await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    
    // In a real app, update backend
    // await fetch('/api/notifications/read-all', { method: 'PUT' });
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.notificationType === filter;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
        if(type === "canceled"){
            return <FaExclamationCircle className="notification-icon system-icon" />;
        }else{
            return <FaBell className="notification-icon default-icon" />;
        }
  };

  // Format timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (

    <div className="notification-container">
      <div className="notification-header">
        <h1 className="notification-title">
          <FaBell className="notification-title-icon" />
          Notifications
        </h1>
        <button 
          onClick={markAllAsRead}
          className="mark-all-button"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter-tab ${filter === 'appointment' ? 'active' : ''}`}
          onClick={() => setFilter('appointment')}
        >
          Appointments
        </button>
        <button 
          className={`filter-tab ${filter === 'message' ? 'active' : ''}`}
          onClick={() => setFilter('message')}
        >
          Messages
        </button>
        <button 
          className={`filter-tab ${filter === 'system' ? 'active' : ''}`}
          onClick={() => setFilter('system')}
        >
          System
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredNotifications.length === 0 && (
        <div className="empty-container">
          <FaBell className="empty-icon" />
          <h3 className="empty-title">No notifications</h3>
          <p className="empty-text">
            You don't have any {filter !== 'all' ? filter : ''} notifications at the moment.
          </p>
        </div>
      )}

      {/* Notifications list */}
      <div className="notification-list">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification._id} 
            className={`notification-item ${notification.isRead ? '' : 'unread'}`}
            onClick={() => markAsRead(notification._id)}
          >
            <div className="notification-content">
              <div className="notification-icon-container">
                {getNotificationIcon(notification.notificationType)}
              </div>
              <div className="notification-text">
                <div className="notification-message-container">
                  <p className={`notification-message ${notification.isRead ? '' : 'unread-text'}`}>
                    {notification.content}
                  </p>
                  {!notification.isRead && (
                    <span className="unread-indicator"></span>
                  )}
                </div>
                <div className="notification-meta">
                  <span className="notification-time">
                    {formatTime(notification.createdAt)}
                  </span>
                  <div className="notification-tags">
                    
                    <span className="notification-tag">
                      {notification.notificationType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default MyNotifications;