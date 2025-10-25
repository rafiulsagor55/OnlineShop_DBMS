import React, { useState, useEffect, useContext } from "react";
import styles from "./Topbar.module.css";
import { Link, useLocation } from "react-router-dom";
import { FaCartArrowDown, FaClipboardList, FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import ProfileDropdown from "../Profile/ ProfileDropdown";
import { UserContext } from "../UserContext";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Notification from "./Notification";

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { searchItem, setSearchItem, cartItemCount, setCartItemCount } = useContext(UserContext);
  const location = useLocation();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [email, setEmail] = useState(null);

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // Get token from cookie
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    console.log("Cookies:", document.cookie);
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") {
        console.log(name + ": " + value);
        return value;
      }
    }
    return null;
  };

  const handleNotificationCount = async (count) => {
    try {
      const formData = new FormData();
      formData.append("count", Number(count));
      console.log("Updating notification count to:", count);
      const response = await fetch("http://localhost:8080/api/notifications/notificationCount", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      showNotif(error.message, "error");
      console.error("Error occurred during notification count update:", error.message);
    }
  };

  const handleCartItemCount = async (count) => {
    try {
      const formData = new FormData();
      formData.append("count", count);
      console.log("Updating cart item count to:", count);
      const response = await fetch("http://localhost:8080/api/cart/cartCount", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      showNotif(error.message, "error");
      console.error("Error occurred during cart item count update:", error.message);
    }
  };

  const connectWebSocket = (email) => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    const token = getTokenFromCookie();

    client.connect(
      { token: token },
      () => {
        setStompClient(client);
        console.log("WebSocket connected for email:", email);
        client.subscribe(`/user/${email}/notification`, (msg) => {
          try {
            const notification = JSON.parse(msg.body);
            setNotifications((prev) => [...prev, notification]);
            showNotif(notification.message, "notification");
            console.log("Received notification:", notification);
            if (location.pathname !== "/notificationPage") {
              setNotificationsCount((prev) => {
                const newCount = prev + 1;
                handleNotificationCount(newCount);
                return newCount;
              });
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            showNotif("Error processing notification", "error");
          }
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        showNotif("Failed to connect to notification service", "error");
      }
    );

    return client;
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("http://localhost:8080/checkToken", {
          method: "POST",
          credentials: "include",
        });
        const result = await response.json();
        setIsTokenValid(result.isTokenValid);
      } catch (error) {
        console.error("Token check failed:", error);
        showNotif("Token check failed", "error");
      }
    };

    const fetchEmail = async () => {
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
        setEmail(email);
      } catch (error) {
        console.error("Error fetching email:", error);
        showNotif("Failed to fetch email", "error");
      }
    };

    const fetchNotificationCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/notifications/count", {
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

        const count = await response.json();
        setNotificationsCount(count.count);
        console.log("Fetched notification count:", count);
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error fetching notification count:", error);
      }
    };

    const fetchCartItemCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/cart/count", {
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

        const count = await response.json();
        setCartItemCount(count);
        console.log("Fetched cart item count:", count);
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error fetching cart item count:", error);
      }
    };

    checkToken();
    fetchEmail();
    fetchNotificationCount();
    fetchCartItemCount();
  }, []);

  useEffect(() => {
    let client;

    if (isTokenValid && email) {
      client = connectWebSocket(email);
    }

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, [isTokenValid, email, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/notificationPage") {
      setNotificationsCount(0);
      handleNotificationCount(0);
    }
    if (location.pathname === "/cartPage") {
      setCartItemCount(0);
      handleCartItemCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (cartItemCount > 0 && location.pathname !== "/cartPage") {
      handleCartItemCount(cartItemCount);
    }
  }, [cartItemCount]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsTokenValid(false);
    } catch (error) {
      console.error("Logout failed:", error);
      showNotif("Logout failed", "error");
    }
  };

  const getButtonClass = (path) => {
    return location.pathname === path
      ? `${styles.cartButton} ${styles.active}`
      : styles.cartButton;
  };

  const getOrderButtonClass = () => {
    return location.pathname === "/order-page"
      ? `${styles.orderButton} ${styles.active}`
      : styles.orderButton;
  };

  return (
    <>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button
            className={`${styles.menuToggle} ${
              isSidebarOpen ? styles.active : ""
            }`}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <div className={styles.hamburger}>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </div>
          </button>
          <h2>Online Shop</h2>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search item"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <button className={styles.searchButton}>
            <FaSearch />
          </button>
        </div>

        {isTokenValid ? (
          <div className={styles.topbarButtons}>
            <Link to="/notificationPage">
              <button
                className={getButtonClass("/notificationPage")}
                title="Notifications"
              >
                <div className={styles.cartContainer}>
                  <IoIosNotifications className={styles.cartIcon} />
                  {notificationsCount > 0 && (
                    <span className={styles.cartBadge}>
                      {notificationsCount}
                    </span>
                  )}
                </div>
              </button>
            </Link>
            <Link to="/cartPage">
              <button className={getButtonClass("/cartPage")} title="Cart">
                <div className={styles.cartContainer}>
                  <FaCartArrowDown className={styles.cartIcon} />
                  {cartItemCount > 0 && (
                    <span className={styles.cartBadge}>{cartItemCount}</span>
                  )}
                </div>
              </button>
            </Link>
            <Link to="/order-page">
              <button className={getOrderButtonClass()} title="Your Orders">
                <FaClipboardList className={styles.cartIcon} />
              </button>
            </Link>
            <ProfileDropdown onLogout={handleLogout} />
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link to="/sign-in">
              <button
                className={`${styles.authButton} ${
                  location.pathname === "/sign-in" ? styles.active : ""
                }`}
              >
                Sign in
              </button>
            </Link>
            <Link to="/sign-up">
              <button
                className={`${styles.authButton} ${
                  location.pathname === "/sign-up" ? styles.active : ""
                }`}
              >
                Sign up
              </button>
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Topbar;