import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './verifyCode.module.css';

const VerifyCode = () => {
    const [code, setCode] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const verifyCode = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email');
        const formData = new FormData();
        formData.append("email", email);
        formData.append("code", code);

        try {
            const response = await fetch('/verifyCode', {
                method: 'POST',
                body: formData
            });
            const text = await response.text();

            if (!response.ok) {
                console.log("error");
            }

            if (text === "Invalid Code!") {
                setCode('');
                setError({
                    code: "Invalid Code!"
                });
            } else {
                setCode('');
                setShowSecondForm(true);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const saveInfo = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email');
        localStorage.setItem("userName", userName);
        
        const userInfo = {
            email: email,
            userName: userName,
            password: password
        };

        try {
            const response = await fetch('/saveUserInfo', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData);
            } else {
                const text = await response.text();
                if (text === '1') {
                    console.log("UserInfo saved Successfully.");
                    navigate('/home');
                } else if (text === '2') {
                    setShowAlert(true);
                    console.log("User already Exists!");
                }
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const closeAlert = () => {
        setShowAlert(false);
        navigate('/login');
    };

    return (
        <div className={styles.body}>
            {/* First Form - Verify Code */}
            <div className={styles.container} style={{ display: showSecondForm ? 'none' : 'flex' }}>
                <div className={styles.loginForm}>
                    <h2>Register</h2>
                    <form onSubmit={verifyCode}>
                        <label htmlFor="code">Verify Code:</label>
                        <input
                            type="number"
                            id="code"
                            className={`${styles.inputField} ${error.code ? styles.errorPlaceholder : ''}`}
                            required
                            placeholder={error.code || "Enter your code"}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button type="submit" className={styles.button}>Submit Code</button>
                    </form>
                    <p className={styles.text}>Already have an account? <a href="/login" className={styles.link}>Login</a></p>
                </div>
            </div>

            {/* Second Form - User Info */}
            <div className={styles.container1} style={{ display: showSecondForm ? 'flex' : 'none' }}>
                {showAlert && (
                    <div className={styles.alertOverlay}>
                        <div className={styles.alertBox}>
                            <p className={styles.alertMessage}>You have already registered with this email! Please Login.</p>
                            <button className={styles.alertButton} onClick={closeAlert}>OK</button>
                        </div>
                    </div>
                )}

                <div className={styles.loginForm}>
                    <h2>Register</h2>
                    <form onSubmit={saveInfo}>
                        <label htmlFor="userName">Name:</label>
                        <input
                            type="text"
                            id="userName"
                            className={`${styles.inputField} ${error.userName ? styles.errorPlaceholder : ''}`}
                            required
                            placeholder={error.userName || "Enter your name"}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className={`${styles.inputField} ${error.password ? styles.errorPlaceholder : ''}`}
                            required
                            placeholder={error.password || "Enter your password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className={styles.button}>Submit</button>
                    </form>
                    <p className={styles.text}>Already have an account? <a href="/login" className={styles.link}>Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;