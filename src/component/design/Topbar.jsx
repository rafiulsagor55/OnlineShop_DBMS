import React, { useState, useEffect, useContext } from "react";
import styles from "./Topbar.module.css";
import { Link } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import ProfileDropdown from "../Profile/ ProfileDropdown";
import { UserContext } from "../UserContext";


const Topbar = ({ toggleSidebar }) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const {searchItem, setSearchItem}=useContext(UserContext);

  useEffect(() => {
    // Fetch the token validity status from backend
    const checkToken = async () => {
      const response = await fetch("http://localhost:8080/checkToken", {
        method: "POST",
        credentials: "include", // Include cookies (token)
      });
      const result = await response.json();
      setIsTokenValid(result.isTokenValid);
    };

    checkToken();
  }, []); // Only run on component mount

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsTokenValid(false);
      // Optionally redirect to home or login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button className={styles.menuToggle} onClick={toggleSidebar}>
          ☰
        </button>
        <h2>Online Shop</h2>
      </div>

      <div className={styles.searchBar}>
        <input type="text" placeholder="Search item" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} />
        <button className={styles.searchButton}><FaSearch /></button>
      </div>

      {/* Conditional Rendering */}
      {isTokenValid ? (
        <div className={styles.topbarButtons}>
          <Link to="cartPage">
            <button className={styles.cartButton}>
              <FaCartArrowDown className={styles.cartIcon} />
            </button>
          </Link>
          <Link to="order-page">
            <button className={styles.cartButton}>
              <FaClipboardList className={styles.cartIcon} />
            </button>
          </Link>
          <ProfileDropdown onLogout={handleLogout} />
        </div>
      ) : (
        <div className={styles.authButtons}>
          <Link to="/sign-in">
            <button className={styles.authButton}>Sign in</button>
          </Link>
          <Link to="/sign-up">
            <button className={styles.authButton}>Sign up</button>
          </Link>
        </div>
      )}

      {/* {isTokenValid && (
        <div className={styles.profilePic}>
          <img src={profilePic} alt="Profile" />
        </div>
      )} */}
    </header>
  );
};

export default Topbar;
