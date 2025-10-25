import React, { useState, useEffect } from "react";
import styles from "./AdminActivityLog.module.css";
import { IoIosNotifications } from "react-icons/io";
import {
  AiOutlineShopping,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { TbFilterEdit } from "react-icons/tb";
import { TbShoppingBagMinus } from "react-icons/tb";
import { BsTruck, BsBoxSeam } from "react-icons/bs";
import { FiActivity } from "react-icons/fi";
import { IoBagAddSharp } from "react-icons/io5";
import { TbShoppingBagEdit } from "react-icons/tb";
import { MdSecurityUpdateGood } from "react-icons/md";

const AdminActivityLog = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // Fetch initial notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/notifications/activity-log",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Refresh notifications every minute to update timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    timestamp = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 31) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    return timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Order Placed":
        return <AiOutlineShopping style={{ color: "#1d918dff" }} />;
      case "processing":
        return <AiOutlineClockCircle style={{ color: "#1d918dff" }} />;
      case "ready":
        return <BsBoxSeam style={{ color: "#1d918dff" }} />;
      case "shipped":
        return <BsTruck style={{ color: "#1d918dff" }} />;
      case "picked":
        return <AiOutlineCheckCircle style={{ color: "#1d918dff" }} />;
      case "delivered":
        return <AiOutlineCheckCircle style={{ color: "#1d918dff" }} />;
      case "cancelled":
        return <AiOutlineCloseCircle style={{ color: "#1d918dff" }} />;
      case "product-add":
        return <IoBagAddSharp style={{ color: "#1d918dff" }} />;
      case "product-edit":
        return <TbShoppingBagEdit style={{ color: "#0c7c75ff" }} />;
      case "filter":
        return <TbFilterEdit style={{ color: "#0c7c75ff" }} />;
      case "product-delete":
        return <TbShoppingBagMinus style={{ color: "#0c7c75ff" }} />;
      case "password-update":
        return <MdSecurityUpdateGood style={{ color: "#0c7c75ff" }} />;
      default:
        return <FiActivity style={{ color: "#0c7c75ff" }} />;
    }
  };

  return (
    <div className={styles.container}>
      {showNotification && (
        <div className={styles.notification}>
          <p>{notificationMessage}</p>
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Activity Log</h1>
        </div>
      </div>

      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <IoIosNotifications style={{ color: "#0c7c75ff" }} />
            </div>
            <h3>No notifications</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          notifications
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem}`}
              >
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <div className={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <h3 className={styles.notificationTitle}>
                      {notification.title}
                    </h3>
                  </div>

                  <p className={styles.notificationMessage}>
                    {notification.message}
                  </p>

                  <div className={styles.notificationMeta}>
                    <span className={styles.notificationTime}>
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AdminActivityLog;
