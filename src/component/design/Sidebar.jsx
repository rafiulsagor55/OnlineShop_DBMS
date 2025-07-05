import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { AiFillHome } from "react-icons/ai";
import { FaMale, FaFemale, FaChild } from "react-icons/fa";

const Sidebar = ({ isHidden }) => {
  const items = [
    { name: "Home", path: "/", icon: <AiFillHome /> },
    { name: "Men's Wear", path: "Mens-Wear", icon: <FaMale /> },
    { name: "Women's Wear", path: "Womens-Wear", icon: <FaFemale /> },
    { name: "Kids", path: "Kids-Wear", icon: <FaChild /> },
    // { name: "New Arrivals", path: "New-Arrivals", icon: <MdNewReleases /> },
  ];

  return (
    <aside className={isHidden ? styles.hidden : styles.sidebar}>
      <nav>
        {items.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
