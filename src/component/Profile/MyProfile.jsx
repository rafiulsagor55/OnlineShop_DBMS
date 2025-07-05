import React from "react";
import styles from "./ProfileDropdown.module.css";
import { FiUser, FiMail, FiX, FiEdit2 } from "react-icons/fi";

const MyProfile = ({ user, onClose, onEditClick }) => {
  return (
    <div className={styles.profileModal}>
      <div className={styles.profileModalOverlay} onClick={onClose} />
      <div className={styles.profileModalContent}>
        <button className={styles.profileModalClose} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.profileModalHeader}>
          <div className={styles.headerBackground} />
          <h2>My Profile</h2>
          <div className={styles.headerDivider} />
        </div>

        <div className={styles.profileModalBody}>
          <div className={styles.profileImageContainer}>
            <div className={styles.imageWrapper}>
              <img
                src={user.image}
                alt="Profile"
                className={styles.modalProfileImage}
              />
              <div className={styles.imageHoverEffect} />
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <FiUser size={16} />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>FULL NAME</span>
                <span className={styles.detailValue}>{user.name}</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <FiMail size={16} />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>EMAIL ADDRESS</span>
                <span className={styles.detailValue}>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.profileModalFooter}>
          <button className={styles.editButton} onClick={onEditClick}>
            <FiEdit2 />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;