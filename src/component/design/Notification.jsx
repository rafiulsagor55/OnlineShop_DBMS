import React, { useEffect } from 'react';
import styles from './Notification.module.css';
import { IoIosNotifications } from "react-icons/io";

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, Math.random() * 2000 + 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
        case 'notification':
        return <IoIosNotifications style={{ color: "#0c7c75ff" }} />;
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
};

export default Notification;