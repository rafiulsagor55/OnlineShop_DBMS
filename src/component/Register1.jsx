import React, { useContext, useState } from "react";
import styles from "./Register1.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

const Register = () => {
    const [email, setEmail] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const {setUserEmail}=useContext(UserContext);
    const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const trimmedEmail = email.trim();
      localStorage.setItem("email", trimmedEmail);
      setUserEmail({email:trimmedEmail});

  
      const formData = new FormData();
      formData.append("email", trimmedEmail);
  
      try {
        const response1 = await fetch("http://localhost:8080/verifyEmail", {
          method: "POST",
          body: formData,
        });
        const text1 = await response1.text();
  
        if (text1 === "1") {
          navigate("/verifyCode");
        }
  
        const response2 = await fetch("http://localhost:8080/sendCode", {
          method: "POST",
          body: formData,
        });
        const text2 = await response2.text();
        console.log(text2);
        if (!response2.ok) {
          console.error("Error during sendCode request");
        }
  
        if (text2 === "0") {
          setShowAlert(true);
        } 
  
        console.log("Response:", text2);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    const closeAlert = () => {
      setShowAlert(false);
      navigate("/login");
    };
  
    return (
      <div className={styles.container}>
        {showAlert && (
          <div className={styles.alertOverlay}>
            <div className={styles.alertBox}>
              <p className={styles.alertText}>You have already registered with this email! Please Login.</p>
              <button className={styles.alertButton} onClick={closeAlert}>OK</button>
            </div>
          </div>
        )}
  
        <div className={styles.form}>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              required
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.button}>Send Code</button>
          </form>
          <p className={styles.text}>
            Already have an account? <Link to="/login" className={styles.link}>Login</Link>
          </p>
        </div>
      </div>
    );
  };

export default Register;