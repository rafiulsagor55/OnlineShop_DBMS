import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import { FiLock, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import Modal from "../design/Modal";
import Notification from "../design/Notification";

const ChangeAdminPassword = ({ onClose, showNotif }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Basic validation
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage("Password must be at least 4 characters long");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    try {
      const response = await fetch("http://localhost:8080/change-admin-password", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to change password");
      }

      const data = await response.text();
      showNotif(data.message || "Password changed successfully", "success");
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Failed to change password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.changePasswordModal}>
      {errorMessage && (
        <Modal
          message={errorMessage}
          onClose={() => setErrorMessage("")}
          key={errorMessage}
        />
      )}

      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.headerBackground} />
          <h2>Change Admin Password</h2>
          <div className={styles.headerDivider} />
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FiLock className={styles.inputIcon} />
              <span>Current Password</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.textInput}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={toggleCurrentPasswordVisibility}
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FiLock className={styles.inputIcon} />
              <span>New Password</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.textInput}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FiLock className={styles.inputIcon} />
              <span>Confirm New Password</span>
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.textInput}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className={styles.passwordRequirements}>
            <h4>Password Requirements:</h4>
            <ul>
              <li>Minimum 4 characters</li>
              {/* <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li> */}
            </ul>
          </div>

          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeAdminPassword;