import React, { useState, useEffect } from "react";
import styles from "./NotificationPage.module.css";
import { FaRegStar, FaStar, FaClipboardList } from "react-icons/fa";
import { BiSolidMessageRounded, BiSolidMessageRoundedDots } from "react-icons/bi";
import { MdSecurity, MdSystemSecurityUpdateGood, MdOutlinePayment } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { GiAlarmClock } from "react-icons/gi";
import { LuPackage2 } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { FaUserPen } from "react-icons/fa6";
import ConfirmModal from "./ConfirmModal";
import Notification from "./Notification";
import { IoIosNotifications } from "react-icons/io";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineShopping,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import {
  BsTruck,
  BsBoxSeam,
  BsShop,
  BsGear,
  BsBellFill,
  BsBox,
} from "react-icons/bs";
import OrderDetails from "./OrderDetails";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [stompClient, setStompClient] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // Get token from cookie
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") {
        return value;
      }
    }
    return null;
  };

  // Fetch initial notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/notifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

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

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    const fetchEmailAndConnectWebSocket = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/SocketDestination", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch email");
        }

        const email = await response.text();
        if (!email) {
          throw new Error("No email found for user");
        }

        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        const token = getTokenFromCookie();

        client.connect(
          { token: token },
          () => {
            setStompClient(client);
            client.subscribe(`/user/${email}/notification`, (msg) => {
              const notification = JSON.parse(msg.body);
              console.log("Received notification:", notification);
              setNotifications((prev) => [notification, ...prev]);
            });
          },
          (error) => {
            console.error("WebSocket connection error:", error);
            showNotif("Failed to connect to notification service", "error");
          }
        );

        return client;
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error setting up WebSocket:", error);
      }
    };

    const client = fetchEmailAndConnectWebSocket();

    return () => {
      client.then((c) => {
        if (c) {
          c.disconnect(() => {
            console.log("WebSocket disconnected");
          });
        }
      });
    };
  }, []);

  // Refresh notifications every minute to update timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      const response = await fetch(
        `http://localhost:8080/api/notifications/${id}/read`,
        {
          method: "POST",
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
    } catch (error) {
      showNotif(error.message, "error");
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = (id) => {
    setNotificationToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (notificationToDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications/${notificationToDelete}`,
          {
            method: "DELETE",
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

        setNotifications(
          notifications.filter(
            (notification) => notification.id !== notificationToDelete
          )
        );
        showNotif("Notification deleted", "success");
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error deleting notification:", error);
      }
    }
    setShowConfirmModal(false);
    setNotificationToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setNotificationToDelete(null);
  };

  const handleNotificationClick = (serialId) => {
    setSelectedOrderId(serialId);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrderId(null);
  };

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "unread") return !notification.read;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
      default:
        return <IoIosNotifications style={{ color: "#0c7c75ff" }} />;
    }
  };

  return (
    <div className={styles.container}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      {showOrderDetails ? (
        <OrderDetails id={selectedOrderId} onClose={handleCloseOrderDetails} />
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <h1>Notifications</h1>
              <div className={styles.headerActions}>
                <div className={styles.stats}>
                  <span className={styles.unreadCount}>
                    {notifications.filter((n) => !n.read).length} unread
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <button
                  className={`${styles.filterButton} ${
                    filter === "all" ? styles.activeFilter : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`${styles.filterButton} ${
                    filter === "unread" ? styles.activeFilter : ""
                  }`}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </button>
              </div>
            </div>
          </div>

          <div className={styles.notificationsList}>
            {filteredNotifications.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <IoIosNotifications style={{ color: "#0c7c75ff" }} />
                </div>
                <h3>No notifications</h3>
                <p>You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    notification.read ? styles.read : styles.unread
                  }`}
                  onClick={() => {handleNotificationClick(notification.serialId); markAsRead(notification.id);}}
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

                  <div className={styles.notificationActions}>
                    <button
                      className={`${styles.actionIcon} ${styles.deleteButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      <RxCross1 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <ConfirmModal
            isOpen={showConfirmModal}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            title="Confirm Deletion"
            message="Are you sure you want to delete this notification? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}
    </div>
  );
};

export default NotificationPage;