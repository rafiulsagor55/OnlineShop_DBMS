import React, { useState, useEffect, useContext } from "react";
import styles from "./Topbar.module.css";
import { Link, useLocation } from "react-router-dom";
import { FaCartArrowDown, FaClipboardList, FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import ProfileDropdown from "../Profile/ ProfileDropdown";
import { UserContext } from "../UserContext";

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { searchItem, setSearchItem } = useContext(UserContext);
  const location = useLocation();
  const cartItemCount = 10;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("http://localhost:8080/checkToken", {
          method: "POST",
          credentials: "include",
        });
        const result = await response.json();
        setIsTokenValid(result.isTokenValid);
      } catch (error) {
        console.error("Token check failed:", error);
      }
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsTokenValid(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getButtonClass = (path) => {
    return location.pathname === path
      ? `${styles.cartButton} ${styles.active}`
      : styles.cartButton;
  };

  const getOrderButtonClass = () => {
    return location.pathname === "/order-page"
      ? `${styles.orderButton} ${styles.active}`
      : styles.orderButton;
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button
          className={`${styles.menuToggle} ${isSidebarOpen ? styles.active : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <div className={styles.hamburger}>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </div>
        </button>
        <h2>Online Shop</h2>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search item"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <button className={styles.searchButton}>
          <FaSearch />
        </button>
      </div>

      {isTokenValid ? (
        <div className={styles.topbarButtons}>
          <Link to="/notifications">
            <button className={getButtonClass("/cartPage")}>
              <div className={styles.cartContainer}>
                <IoIosNotifications className={styles.cartIcon} />
                {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemCount}</span>
                )}
              </div>
            </button>
          </Link>
          <Link to="/cartPage">
            <button className={getButtonClass("/cartPage")}>
              <div className={styles.cartContainer}>
                <FaCartArrowDown className={styles.cartIcon} />
                {/* {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemCount}</span>
                )} */}
              </div>
            </button>
          </Link>
          <Link to="/order-page">
            <button className={getOrderButtonClass()}>
              <FaClipboardList className={styles.cartIcon} />
            </button>
          </Link>
          <ProfileDropdown onLogout={handleLogout} />
        </div>
      ) : (
        <div className={styles.authButtons}>
          <Link to="/sign-in">
            <button
              className={`${styles.authButton} ${
                location.pathname === "/sign-in" ? styles.active : ""
              }`}
            >
              Sign in
            </button>
          </Link>
          <Link to="/sign-up">
            <button
              className={`${styles.authButton} ${
                location.pathname === "/sign-up" ? styles.active : ""
              }`}
            >
              Sign up
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Topbar;