import React, { useState, useRef, useEffect } from "react";
import styles from "./DesignDemo.module.css";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

const DesignDemo = () => {
  const [sidebarHidden, setSidebarHidden] = useState(window.innerWidth <= 768);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const outletRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setSidebarHidden(isMobile);
      if (isMobile) setIsCollapsed(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarHidden((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarHidden(true);
    }
  };

  return (
    <>
      <ScrollToTop outletRef={outletRef} />
      <div className={styles.layout}>
        <Topbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={!sidebarHidden && !isCollapsed}
        />
        <div className={styles.container}>
          <Sidebar
            isHidden={sidebarHidden}
            isCollapsed={isCollapsed}
            onMenuClick={handleMenuClick}
          />
          <div ref={outletRef} className={styles.outletWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignDemo;