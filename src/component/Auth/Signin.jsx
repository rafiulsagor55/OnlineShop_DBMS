import React, { useState } from "react";
import styles from "./Signin.module.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Signin = () => {
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
      const response = await fetch("http://localhost:8080/login", {
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
      navigate("/");



    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    setIsLoading(true);
    fetch("http://localhost:8080/api/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    }).then((res) => {
      setIsLoading(false);
      if (res.ok) {
        navigate("/");
      } else {
        setError("Google login failed. Please try again.");
      }
    }).catch(() => {
      setIsLoading(false);
      setError("Network error. Please try again.");
    });
  };

  return (
    <div className={styles.body}>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Welcome to Online Shop</h2>
            <p>Sign in to continue to your account</p>
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
              <div className={styles.forgotPassword}>
                <Link to="/forgot-password">Forgot password?</Link>
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
                "Sign In"
              )}
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <GoogleOAuthProvider clientId="421406248780-c6pukobh1dr5blgsa7u4ee7l3luml5iu.apps.googleusercontent.com">
              <div className={styles.googleButton}>
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => setError("Google login failed")}
                  useOneTap
                  text="continue_with"
                  // theme="filled_blue"
                  size="large"
                  width="100%"
                />
              </div>
            </GoogleOAuthProvider>

            <div className={styles.registerLink}>
              Don't have an account? <Link to="/sign-up">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;