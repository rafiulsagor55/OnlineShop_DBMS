import React, { useContext, useState } from "react";
import styles from "./Signin.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { PiPassword } from "react-icons/pi";
import { UserContext } from "../UserContext";

const VerifyEmail = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {userEmail}=useContext(UserContext);
  console.log(userEmail);

  const location = useLocation();
  const data = location.state;
  const email = localStorage.getItem("email");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("code",password);

    try {
      const response = await fetch("http://localhost:8080/verify-email", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log(errorData.message);
        console.log(errorData);
        throw new Error(errorData);
      }

      const data = await response.text();
      console.log("Login successful:", data);

      navigate(data);
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
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          navigate("/");
        } else {
          setError("Google login failed. Please try again.");
        }
      })
      .catch(() => {
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
            <h2>Continue Sign up</h2>
            <p>{data}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="password">Verification code</label>
              <div className={styles.inputContainer}>
                <PiPassword className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your verification code"
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
                "Verify Email"
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
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
