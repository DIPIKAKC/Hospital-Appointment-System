import React, { useState, useEffect } from 'react';
import { FaBell, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import '../User/Notification.css';
import DocBar from '../../Components/Doctor/DoctorNavbar';
import FooterDoc from '../../Components/Doctor/FooterDoctor';


const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const userId = localStorage.getItem('id')
  const userType = 'doctor'



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

    const markOneAsRead = async (id) => {
      try {
        const res = await fetch(`http://localhost:5000/auth/notification/${id}/read`, {
          method: 'PATCH'
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        }
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    };

    const markAllAsRead = async () => {
      try {
        const res = await fetch(`http://localhost:5000/auth/notification/read-all/${userId}/${userType}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, userType })
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
      } catch (err) {
        console.error("Failed to mark all as read", err);
      }
    };

    useEffect(()=>{
        fetchNotifications()
    },[])


  // filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.notificationType === filter;
  });

  // notification icon based on type
  const getNotificationIcon = (type) => {
        if(type === "canceled"){
            return <FaExclamationCircle className="notification-icon system-icon" />;
        }else{
            return <FaBell className="notification-icon default-icon" />;
        }
  };

  // format timestamp
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

    <>
    <DocBar />

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
            onClick={() => markOneAsRead(notification._id)}
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
    
    <FooterDoc />
    </>
  );
};

export default MyNotifications;