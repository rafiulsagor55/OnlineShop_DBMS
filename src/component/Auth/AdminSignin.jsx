import React, { useState } from "react";
import styles from "./Signin.module.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const AdminSignin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8080/admin-login", {
        method: "POST",
        body: formData,
        credentials:'include',
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong");
      }

      const data = await response.text();
      console.log("Login successful:", data);

      // এখানে আপনি navigate করতে পারেন বা স্টেট আপডেট করতে পারেন
      navigate("/admin");



    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className={styles.body}>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Online Shop Admin Login Page</h2>
            <p>Login in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputContainer}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputContainer}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Login In"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;