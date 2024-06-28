import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import '../styles/Notifications.css';

const Notifications = ({ notifications, showNotifications, toggleNotifications }) => {
    const [notificationList, setNotificationList] = useState(notifications);

    useEffect(() => {
        setNotificationList(notifications);
    }, [notifications]);

    const markAsRead = (notificationId) => {
        axios.put(`http://localhost:3001/api/notifications/${notificationId}/read`)
            .then(response => {
                setNotificationList(prevNotifications => 
                    prevNotifications.map(notification =>
                        notification._id === notificationId
                            ? { ...notification, read: true }
                            : notification
                    )
                );
            })
            .catch(error => console.error('Erreur lors de la mise à jour de la notification:', error));
    };

    return (
        <div className="notifications-container">
            <button className="nav-link btn" onClick={toggleNotifications}>
                <FaBell />
                {notificationList.filter(notification => !notification.read).length > 0 && (
                    <span className="badge">
                        {notificationList.filter(notification => !notification.read).length}
                    </span>
                )}
            </button>
            {showNotifications && (
                <div className="notifications-dropdown">
                    {notificationList.length === 0 ? (
                        <span className="dropdown-item">Aucune notification</span>
                    ) : (
                        notificationList.map((notification, index) => (
                            <div key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`} onClick={() => markAsRead(notification._id)}>
                                <p>{notification.message}</p>
                                <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                {!notification.read && <FaCheckCircle className="new-icon" />}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;

