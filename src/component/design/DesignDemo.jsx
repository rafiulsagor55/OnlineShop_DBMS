import React, { useState,useRef } from "react";
import styles from "./DesignDemo.module.css";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

const DesignDemo = () => {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const outletRef = useRef(null);
  const toggleSidebar = () => {
    setSidebarHidden((prev) => !prev);
  };
  return (
    <>
      <ScrollToTop outletRef={outletRef} />
      <div className={styles.layout}>
        <Topbar toggleSidebar={toggleSidebar} />
        <div className={styles.container}>
          <Sidebar isHidden={sidebarHidden} className={styles.sidebar}/>
          <div ref={outletRef} className={styles.outletWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignDemo;
