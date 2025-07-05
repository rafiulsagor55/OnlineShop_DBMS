import React, { useState, useRef } from "react";
import styles from "./EditProfile.module.css";
import { FiUser, FiMail, FiX, FiCamera, FiSave } from "react-icons/fi";
import Modal from "../design/Modal";
import Notification from "../design/Notification";

const EditProfile = ({ onClose, user: initialUser, onSave,showNotif }) => {
  const [user, setUser] = useState(initialUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialUser.image);
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  // Handle file upload (convert to base64)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64
      reader.onload = () => resolve(reader.result); // Resolve with base64 string
      reader.onerror = (error) => reject(error); // Reject if error occurs
    });
  };

  const handleImageChange = async (e) => {
    
    const file = e.target.files[0];
    if(!file)return;
    
      if (!file.type.match('image.*')){
        setErrorMessage("Please select an image.")
        return;
    }

      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must be less than 2MB");
        return;
      }

      // 2. Create Object URL for dimension check
      const objectURL = URL.createObjectURL(file);
      const img = new Image();

      img.onload = async () => {
        // Always revoke the object URL after image is loaded
        URL.revokeObjectURL(objectURL); // ✅ Memory cleanup

        const { width, height } = img;

        // 3. Check for 1:1 aspect ratio (with tolerance)
        if (Math.abs(width - height) > 5) {
          setErrorMessage("Image must have a 1:1 aspect ratio");
          return;
        }

        try {
          // 4. Convert to base64
          const base64String = await convertToBase64(file);

          // 5. Store the base64 image in state
        setImagePreview(base64String);
        setUser(prev => ({ ...prev, newImage: base64String }));
        } catch (error) {
          setErrorMessage("Error uploading image: " + error.message);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectURL); // Even on error, clean up
        setErrorMessage("Error loading image");
      };

      img.src = objectURL; // 6. Start loading the image
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("imageData", user.newImage || user.image);
    try {
      const response = await fetch("http://localhost:8080/edit-profile", {
        method: "POST",
        body: formData,
        credentials:'include',
      });
      await onSave({
        name: user.name,
        image: user.newImage || user.image
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong");
      }
      const data = await response.text();
      showNotif(data, 'success')
      console.log("Login successful:", data);
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.editProfileModal}>
        {errorMessage && (
          <Modal
            message={errorMessage}
            onClose={() => {
              setErrorMessage(""); // Clear the error when modal closes
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input
              }
            }}
            key={errorMessage} // Force re-render with new error
          />
        )}

      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.headerBackground} />
          <h2>Edit Profile</h2>
          <div className={styles.headerDivider} />
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.profileImageContainer}>
            <div className={styles.imageWrapper} onClick={triggerFileInput}>
              <img
                src={imagePreview}
                alt="Profile"
                className={styles.profileImage}
              />
              <div className={styles.imageOverlay}>
                <FiCamera size={24} />
                <span>Change Photo</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className={styles.fileInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FiUser className={styles.inputIcon} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FiMail className={styles.inputIcon} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={user.email}
              className={styles.textInput}
              readOnly
              disabled
            />
            <div className={styles.emailNote}>
              Email address cannot be changed
            </div>
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
              <FiSave className={styles.saveIcon} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;