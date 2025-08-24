import React, { useState, useEffect, useRef } from 'react';
import { Navigate, NavLink, Outlet, useLocation,useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { 
  FaHome, FaBox, FaFileInvoiceDollar, FaUsers, 
  FaChartLine, FaBars, FaTimes, FaUser, 
  FaChevronDown, FaChevronRight, FaMale, FaFemale, FaChild, FaFilter
} from 'react-icons/fa';
import { ImManWoman } from "react-icons/im";
import { IoBagAddSharp } from "react-icons/io5";
import ProfileDropdown from '../Profile/ ProfileDropdown';
import ProfileDropdownAdmin from '../Profile/ProfileDropdownAdmin';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target)) {
        setIsSidebarCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-collapse sidebar on mobile when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const checkValidity = async () => {
          try {
            const response = await fetch("http://localhost:8080/admin-validity", {
              credentials: "include",
            });
    
            if (!response.ok) {
              navigate("/admin-sign-in");
              return;
            }                
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            
          }
        };
    
        checkValidity();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768) setIsSidebarCollapsed(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin-logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/admin-sign-in");
      }      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      icon: FaHome,
      text: 'Dashboard',
      link: ''
    },
    {
      icon: FaBox,
      text: 'Products',
      link: 'all-products',
      children: [
        { text: "Men's Wear", link: 'mens-wear', icon: FaMale },
        { text: "Women's Wear", link: 'womens-wear', icon: FaFemale },
        { text: "Kid's Wear", link: 'kids-wear', icon: FaChild },
        { text: "Unisex", link: 'unisex', icon: ImManWoman },
      ]
    },
    {
      icon: IoBagAddSharp,
      text: 'Add Product',
      link: 'add-product',
    },
    {
      icon: FaFileInvoiceDollar,
      text: 'Orders',
      link: 'orders',
    },
    {
      icon: FaUsers,
      text: 'Customers',
      link: 'customers',
      children: [
        { text: 'Customer List', link: 'customer-list' },
        { text: 'Segments', link: 'segments' }
      ]
    },
    {
      icon: FaChartLine,
      text: 'Analytics',
      link: 'analytics'
    },
    {
      icon: FaFilter,
      text: 'Add Filter Option',
      link: 'add-filter-option',
      children: [
        { text: "Men's Wear", link: 'filter-mens-wear', icon: FaMale ,state: "Male"},
        { text: "Women's Wear", link: 'filter-womens-wear', icon: FaFemale, state: "Female" },
        { text: "Kid's Wear", link: 'filter-kids-wear', icon: FaChild, state: "Kids" },
        { text: "Unisex", link: 'filter-unisex-wear', icon: ImManWoman, state: "Unisex" },
      ]
    }
  ];

  // Check if any child route or its nested routes are active
  const isChildActive = (children) => {
    if (!children) return false;
    return children.some(child => 
      location.pathname.startsWith(`/admin/${child.link}`)
    );
  };

  return (
    <div className={styles.container}>
      {!isSidebarCollapsed && window.innerWidth <= 768 && (
        <div className={styles.mobileOverlay} onClick={toggleSidebar} />
      )}

      <aside 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <FaBox />
            </div>
            {!isSidebarCollapsed && (
              <span className={styles.logoText}>Online Shop</span>
            )}
          </div>
          <button 
            className={styles.toggleButton} 
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          <nav className={styles.nav}>
            <ul>
              {navItems.map((item, index) => (
                <React.Fragment key={index}>
                  <li
                    className={`${styles.navItem} ${expandedMenus[item.text] ? styles.expanded : ''}`}
                  >
                    <NavLink 
                      to={item.link}
                      className={({ isActive }) => 
                        `${styles.navLink} ${isActive && !item.children || (!expandedMenus[item.text] && isChildActive(item.children)) ? styles.active : ''}`
                      }
                      onClick={(e) => {
                        if (item.children) {
                          e.preventDefault();
                          toggleMenu(item.text);
                        } else {
                          handleNavClick();
                        }
                      }}
                      end={item.link === ''} // Ensure exact match for Dashboard
                    >
                      <item.icon className={styles.navIcon} />
                      {!isSidebarCollapsed && (
                        <>
                          <span className={styles.navText}>{item.text}</span>
                          {item.children && (
                            <span className={styles.menuToggle}>
                              {expandedMenus[item.text] ? <FaChevronDown /> : <FaChevronRight />}
                            </span>
                          )}
                        </>
                      )}
                      {isSidebarCollapsed && <span className={styles.tooltip}>{item.text}</span>}
                    </NavLink>
                  </li>
                  
                  {item.children && expandedMenus[item.text] && !isSidebarCollapsed && (
                    <ul className={styles.subMenu}>
                      {item.children.map((child, childIndex) => (
                        <li 
                          key={childIndex}
                          className={styles.subMenuItem}
                        >
                          <NavLink 
                            to={child.link}
                            state={{ gender: `${child.state}` }}
                            className={({ isActive }) => 
                              `${styles.subMenuLink} ${
                                isActive || location.pathname.startsWith(`/admin/${child.link}/`) 
                                ? styles.active 
                                : ''
                              }`
                            }
                            onClick={handleNavClick}
                          >
                            {child.icon && <child.icon className={styles.navIcon} />}
                            {child.text}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <ProfileDropdownAdmin onLogout={handleLogout} isOpen={isOpen} setIsOpen={setIsOpen} setIsSidebarCollapsed={setIsSidebarCollapsed} isSidebarCollapsed={isSidebarCollapsed}/>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {isSidebarCollapsed && window.innerWidth <= 768 && (
          <button 
            className={styles.mobileToggle} 
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        )}
        
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;