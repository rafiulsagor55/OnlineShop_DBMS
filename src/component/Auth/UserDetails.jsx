import React, { useState, useRef } from "react";
import styles from "./UserDetails.module.css";
import { FiUser, FiLock, FiEye, FiEyeOff, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Modal from "../design/Modal";

const UserDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
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



  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setError(null);
    const formmData = new FormData();
      formmData.append("name", formData.name);
      formmData.append("password",formData.password);
      formmData.append("confirmPassword", formData.confirmPassword);
      formmData.append("imageData", formData.profileImage);

    try {
      const response = await fetch("http://localhost:8080/save-details", {
        method: "POST",
        body: formmData,
        credentials:'include',
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong");
      }

      const data = await response.text();
      console.log("Login successful:", data);

      // এখানে আপনি navigate করতে পারেন বা স্টেট আপডেট করতে পারেন
      navigate("/");

    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  };


  return (
    <div className={styles.body}>
      <div className={styles.container}>
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
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Create Your Account</h2>
            <p>Join us today and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.profileSection}>
              <div className={styles.avatarContainer}>
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Profile preview" 
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <FiUser className={styles.avatarIcon} />
                  </div>
                )}
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={triggerFileInput}
                >
                  <FiCamera className={styles.uploadIcon} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <div className={styles.inputContainer}>
                <FiUser className={styles.inputIcon} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? styles.errorInput : ""}
                />
              </div>
              {errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputContainer}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={errors.password ? styles.errorInput : ""}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <div className={styles.errorText}>{errors.password}</div>}
              <div className={styles.passwordHint}>
                Use 4 or more characters
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.inputContainer}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? styles.errorInput : ""}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className={styles.errorText}>{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className={styles.loginLink}>
              Already have an account? <a href="/signin">Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;