import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfileDropdown.module.css";
// import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiEdit2,
  FiLock,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import defaultAvatar from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (2).png";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Notification from "../design/Notification";

const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  // const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/user-details", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser({
          name: data.name || "Error",
          email: data.email || "Error@example.com",
          image: data.imageData || data.imagePath || defaultAvatar,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser({
          name: "Error",
          email: "Error@example.com",
          image: defaultAvatar,
        });
      }
    };

    fetchUserData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleProfileClick = () => {
    // setIsOpen(false);
    setShowProfile(true);
  };


  if (!user) return <div className={styles.profileSkeleton} />;

  return (
    <div className={styles.profileContainer} ref={dropdownRef}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      
      {/* Dropdown Trigger */}
      <div
        className={`${styles.profileTrigger} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={user.image} alt="Profile" className={styles.profileImage} />
        <span className={styles.userName}>{user.name}</span>
        <FiChevronDown className={styles.chevron} />
      </div>

      {/* Dropdown Menu */}
      <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}>
        <div className={styles.profileHeader}>
          <img src={user.image} alt="Profile" className={styles.headerImage} />
          <div className={styles.userInfo}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <div className={styles.menuSection}>
          <h4 className={styles.sectionTitle}>Account</h4>
          <button className={styles.menuItem} onClick={handleProfileClick}>
            <FiUser className={styles.menuIcon} />
            <span className={styles.menuTextColor}>My Profile</span>
          </button>
          <button
            className={styles.menuItem}
            onClick={() => setShowEditProfile(true)}
          >
            <FiEdit2 className={styles.menuIcon} />
            <span className={styles.menuTextColor}>Edit Profile</span>
          </button>
          <button
            className={styles.menuItem}
            onClick={() => setShowChangePassword(true)}
          >
            <FiLock className={styles.menuIcon} />
            <span className={styles.menuTextColor}>Change Password</span>
          </button>
        </div>

        <div className={styles.divider} />

        <button
          className={`${styles.menuItem} ${styles.logoutItem}`}
          onClick={handleLogoutClick}
        >
          <FiLogOut className={styles.menuIcon} />
          <span className={styles.menuTextColor}>Log Out</span>
        </button>
      </div>

      {/* Modal Components */}
      {showProfile && (
        <MyProfile
          user={user}
          onClose={() => setShowProfile(false)}
          onEditClick={() => {
            setShowProfile(false);
            setShowEditProfile(true);
          }}
        />
      )}

      {showEditProfile && (
        <EditProfile
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={async (updatedData) => {
            setUser((prev) => ({
              ...prev,
              name: updatedData.name,
              image:
                updatedData.image instanceof File
                  ? URL.createObjectURL(updatedData.image)
                  : updatedData.image,
            }));
          }}
          showNotif={showNotif}
        />
      )}

      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          showNotif={showNotif}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;