import React, { useState, useEffect } from "react";
import styles from "./AdminOrdersPage.module.css";
import { TbCoinTaka, TbCoinTakaFilled } from "react-icons/tb";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiPrinter,
  FiMail,
  FiDollarSign,
} from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import {
  BsThreeDotsVertical,
  BsCheckCircle,
  BsTruck,
  BsBoxSeam,
  BsBellFill,
  BsArrowLeftRight,
  BsShop,
  BsGear,
} from "react-icons/bs";
import {
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineShopping,
} from "react-icons/ai";
import {
  RiMoneyDollarCircleLine,
  RiNotificationBadgeLine,
} from "react-icons/ri";
import {
  MdOutlineLocalShipping,
  MdOutlinePayment,
  MdOutlineEdit,
} from "react-icons/md";

const AdminOrdersPage = () => {
  // Sample orders data with pickup and delivery options
  const initialOrders = [
    {
      id: "ORD-2023-001",
      customer: "John Doe",
      date: new Date(Date.now() - 86400000 * 2),
      items: [
        { id: 1, name: "Cotton T-shirt - Blue (M)", price: 960, quantity: 1 },
        { id: 2, name: "Jeans - Black (32)", price: 1200, quantity: 1 },
      ],
      status: "Order Placed",
      paymentMethod: "COD",
      payment: "pending",
      total: 2160,
      delivery: "home",
      address: "123 Main St, Dhaka",
      contact: "+8801712345678",
      email: "john.doe@example.com",
      processedDate: new Date(Date.now() - 86400000 * 1.5),
      readyDate: new Date(Date.now() - 86400000 * 2),
      pickedDate: new Date(Date.now() - 86400000 * 1),
      originalState: null,
    },
    {
      id: "ORD-2023-002",
      customer: "Sarah Smith",
      date: new Date(Date.now() - 86400000 * 1),
      items: [
        { id: 3, name: "Running Shoes - White (42)", price: 2500, quantity: 1 },
        { id: 4, name: "Baseball Cap - Red", price: 350, quantity: 2 },
      ],
      status: "ready",
      paymentMethod: "Bkash",
      payment: "paid",
      total: 3200,
      delivery: "pickup",
      pickupLocation: "Main Store, Gulshan, Dhaka",
      storeContact: "+8809612345678",
      contact: "+8801812345678",
      email: "sarah.smith@example.com",
      processedDate: new Date(Date.now() - 86400000 * 0.8),
      readyDate: new Date(Date.now() - 86400000 * 0.5),
      originalState: null,
    },
    {
      id: "ORD-2023-003",
      customer: "Michael Johnson",
      date: new Date(Date.now() - 86400000 * 3),
      items: [
        { id: 5, name: "Wireless Earbuds", price: 1800, quantity: 1 },
        { id: 6, name: "Charger Cable", price: 300, quantity: 2 },
      ],
      status: "picked",
      paymentMethod: "COD",
      payment: "paid",
      total: 2400,
      delivery: "pickup",
      pickupLocation: "Uttara Branch, Dhaka",
      contact: "+8801912345678",
      email: "michael.j@example.com",
      processedDate: new Date(Date.now() - 86400000 * 2.5),
      readyDate: new Date(Date.now() - 86400000 * 2),
      pickedDate: new Date(Date.now() - 86400000 * 1),
      originalState: null,
    },
    {
      id: "ORD-2023-004",
      customer: "Emily Wilson",
      date: new Date(Date.now() - 86400000 * 4),
      items: [
        { id: 1, name: "Cotton T-shirt - Blue (M)", price: 960, quantity: 2 },
      ],
      status: "delivered",
      paymentMethod: "COD",
      payment: "paid",
      total: 1920,
      delivery: "home",
      address: "789 Pine Rd, Sylhet",
      contact: "+8801612345678",
      email: "emily.w@example.com",
      processedDate: new Date(Date.now() - 86400000 * 3.5),
      shippedDate: new Date(Date.now() - 86400000 * 3),
      deliveredDate: new Date(Date.now() - 86400000 * 1),
      tracking: "DHL-123456789",
      originalState: null,
    },
    {
      id: "ORD-2023-005",
      customer: "David Brown",
      date: new Date(Date.now() - 86400000 * 0.5),
      items: [
        { id: 3, name: "Running Shoes - White (42)", price: 2500, quantity: 2 },
      ],
      status: "processing",
      paymentMethod: "Bkash",
      payment: "paid",
      total: 5000,
      delivery: "pickup",
      pickupLocation: "Dhanmondi Branch, Dhaka",
      contact: "+8801512345678",
      email: "david.b@example.com",
      processedDate: new Date(Date.now() - 86400000 * 0.3),
      originalState: null,
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const refreshOrders = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showNotification("Orders refreshed successfully");
    }, 1000);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contact.includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        // Store original state if this is the first modification
        const originalState = order.originalState || {
          status: order.status,
          payment: order.payment,
          processedDate: order.processedDate,
          readyDate: order.readyDate,
          shippedDate: order.shippedDate,
          pickedDate: order.pickedDate,
          deliveredDate: order.deliveredDate,
          cancelledDate: order.cancelledDate,
          tracking: order.tracking,
          refundAmount: order.refundAmount,
        };

        const updatedOrder = { 
          ...order,
          originalState,
          status: newStatus,
        };

        // Update payment status if order is delivered or picked
        if (newStatus === "delivered" || newStatus === "picked") {
          updatedOrder.payment = "paid";
        }

        // Set dates based on status
        if (newStatus === "shipped") {
          updatedOrder.shippedDate = new Date();
          updatedOrder.tracking = `DHL-${Math.floor(
            100000000 + Math.random() * 900000000
          )}`;
        } else if (newStatus === "ready") {
          updatedOrder.readyDate = new Date();
        } else if (newStatus === "picked") {
          updatedOrder.pickedDate = new Date();
        } else if (newStatus === "delivered") {
          updatedOrder.deliveredDate = new Date();
        } else if (newStatus === "cancelled") {
          updatedOrder.cancelledDate = new Date();
          // Only show refund if payment was actually made
          if (order.payment === "paid") {
            updatedOrder.refundAmount = order.total + (order.delivery === "home" ? 50 : 0);
          } else {
            updatedOrder.refundAmount = 0;
          }
          // Reset other dates for cancelled orders
          updatedOrder.shippedDate = null;
          updatedOrder.readyDate = null;
          updatedOrder.pickedDate = null;
          updatedOrder.deliveredDate = null;
        }

        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
    setSelectedOrder(updatedOrders.find((order) => order.id === orderId));
    showNotification(`Order ${orderId} status updated to ${newStatus}`);
    setShowActionMenu(null);
  };

  const revertToOriginalState = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId && order.originalState) {
        // Revert to original state and clear the originalState
        return {
          ...order,
          ...order.originalState,
          originalState: null,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setSelectedOrder(updatedOrders.find((order) => order.id === orderId));
    showNotification(`Order ${orderId} reverted to original state`);
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce(
      (sum, order) =>
        sum +
        (order.status === "delivered" || order.status === "picked"
          ? order.total
          : 0),
      0
    ),
    processingCount: orders.filter((order) => order.status === "processing")
      .length,
    readyCount: orders.filter((order) => order.status === "ready").length,
    shippedCount: orders.filter((order) => order.status === "shipped").length,
    deliveredCount: orders.filter((order) => order.status === "delivered")
      .length,
    pickedCount: orders.filter((order) => order.status === "picked").length,
    cancelledCount: orders.filter((order) => order.status === "cancelled")
      .length,
    todayOrders: orders.filter(
      (order) =>
        new Date(order.date).toDateString() === new Date().toDateString()
    ).length,
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (date) => {
    if (!date) return "N/A";
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "New Orders") setSelectedStatus("Order Placed");
    else if (tab === "processing") setSelectedStatus("processing");
    else if (tab === "ready") setSelectedStatus("ready");
    else if (tab === "shipped") setSelectedStatus("shipped");
    else if (tab === "delivered") setSelectedStatus("delivered");
    else if (tab === "picked") setSelectedStatus("picked");
    else if (tab === "cancelled") setSelectedStatus("cancelled");
    else setSelectedStatus("all");
    setCurrentPage(1);
  };

  const handlePrintInvoice = () => {
    showNotification("Invoice sent to printer", "info");
    setShowActionMenu(null);
  };

  const handleEmailCustomer = () => {
    showNotification(`Email sent to ${selectedOrder.customer}`, "info");
    setShowActionMenu(null);
  };

  const handleProcessRefund = () => {
    showNotification(`Refund processed for order ${selectedOrder.id}`, "info");
    setShowActionMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionMenu && !event.target.closest(`.${styles.actionMenu}`)) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionMenu]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "ready":
        return "Ready for Pickup";
      case "picked":
        return "Picked Up";
      case "cancelled":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Orders Dashboard</h1>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders by ID, name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={styles.refreshBtn}
            onClick={refreshOrders}
            disabled={isLoading}
            aria-label="Refresh orders"
          >
            <FiRefreshCw className={isLoading ? styles.spin : ""} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className={styles.dashboardContent}>
        <div className={styles.quickStatsTabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("overview")}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "orders" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("orders")}
          >
            All Orders
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "New Orders" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("New Orders")}
          >
            New Orders
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "processing" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("processing")}
          >
            Processing
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "ready" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("ready")}
          >
            Ready
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "shipped" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("shipped")}
          >
            Shipped
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "delivered" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("delivered")}
          >
            Delivered
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "picked" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("picked")}
          >
            Picked Up
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "cancelled" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {activeTab === "overview" && (
          <div className={styles.summaryCards}>
            <div className={`${styles.card} ${styles.primary}`}>
              <div className={styles.cardIcon}>
                <BsBoxSeam />
              </div>
              <div className={styles.cardContent}>
                <h3>Total Orders</h3>
                <p>{stats.totalOrders}</p>
                <span className={styles.cardSubtext}>
                  {stats.todayOrders} today
                </span>
              </div>
            </div>
            <div className={`${styles.card} ${styles.success}`}>
              <div className={styles.cardIcon}>
                <TbCoinTaka />
              </div>
              <div className={styles.cardContent}>
                <h3>Total Sales</h3>
                <p>৳{stats.totalRevenue.toLocaleString()}</p>
                <span className={styles.cardSubtext}>
                  From completed orders
                </span>
              </div>
            </div>
            <div className={`${styles.card} ${styles.success}`}>
              <div className={styles.cardIcon}>
                <FaRegCheckCircle />
              </div>
              <div className={styles.cardContent}>
                <h3>Delivered</h3>
                <p>{stats.deliveredCount}</p>
              </div>
            </div>
            <div className={`${styles.card} ${styles.warning}`}>
              <div className={styles.cardIcon}>
                <AiOutlineClockCircle />
              </div>
              <div className={styles.cardContent}>
                <h3>Processing</h3>
                <p>{stats.processingCount}</p>
                <span className={styles.cardSubtext}>Needs attention</span>
              </div>
            </div>
            <div className={`${styles.card} ${styles.info}`}>
              <div className={styles.cardIcon}>
                <BsShop />
              </div>
              <div className={styles.cardContent}>
                <h3>Ready</h3>
                <p>{stats.readyCount}</p>
                <span className={styles.cardSubtext}>For pickup</span>
              </div>
            </div>
            <div className={`${styles.card} ${styles.purple}`}>
              <div className={styles.cardIcon}>
                <BsTruck />
              </div>
              <div className={styles.cardContent}>
                <h3>Shipped</h3>
                <p>{stats.shippedCount}</p>
                <span className={styles.cardSubtext}>In transit</span>
              </div>
            </div>
            <div className={`${styles.card} ${styles.danger}`}>
              <div className={styles.cardIcon}>
                <AiOutlineCloseCircle />
              </div>
              <div className={styles.cardContent}>
                <h3>Cancelled</h3>
                <p>{stats.cancelledCount}</p>
                <span className={styles.cardSubtext}>Refund processing</span>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "overview" && (
          <div className={styles.ordersTableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>
                <h2>Order List</h2>
                <span className={styles.tableSubtitle}>
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredOrders.length)} of{" "}
                  {filteredOrders.length} orders
                </span>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Delivery Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((order) => (
                      <tr
                        key={order.id}
                        className={styles.clickableRow}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        <td className={styles.orderId}>{order.id}</td>
                        <td>
                          <div className={styles.customerCell}>
                            <span className={styles.customerName}>
                              {order.customer}
                            </span>
                            <span className={styles.customerContact}>
                              {order.contact}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.dateCell}>
                            <span className={styles.date}>
                              {formatDateTime(new Date(order.date))}
                            </span>
                            <span className={styles.relativeTime}>
                              {formatRelativeTime(new Date(order.date))}
                            </span>
                          </div>
                        </td>
                        <td className={styles.amount}>৳{order.total}</td>
                        <td>
                          <span
                            className={`${styles.paymentBadge} ${
                              styles[order.paymentMethod.toLowerCase()]
                            }`}
                          >
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.paymentBadge} ${
                              styles[order.payment]
                            }`}
                          >
                            {order.payment === "paid" ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.deliveryBadge} ${
                              styles[order.delivery]
                            }`}
                          >
                            {order.delivery === "home"
                              ? "Home Delivery"
                              : "Pickup from store"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[order.status]
                            }`}
                          >
                            {getStatusDisplay(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className={styles.noResults}>
                        <div className={styles.noResultsContent}>
                          <AiOutlineInfoCircle />
                          <p>No orders found matching your criteria</p>
                          <button
                            className={styles.clearFilters}
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedStatus("all");
                              setActiveTab("orders");
                            }}
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.orderDetailModal}>
            <div className={styles.modalHeader}>
              <h2>Order ID: {selectedOrder.id}</h2>
              <div className={styles.modalActions}>
                <button
                  className={styles.closeModal}
                  onClick={() => {
                    setSelectedOrder(null);
                    setShowActionMenu(null);
                  }}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className={styles.modalContent}>
              <div
                className={`${styles.statusTimeline} ${
                  selectedOrder.delivery === "pickup"
                    ? styles.pickupTimeline
                    : ""
                }`}
              >
                <div className={`${styles.timelineStep} ${styles.completed}`}>
                  <div className={styles.stepIcon}>
                    <AiOutlineClockCircle />
                  </div>
                  <div className={styles.stepContent}>
                    <h4>Order Placed</h4>
                    <p>{formatDateTime(new Date(selectedOrder.date))}</p>
                  </div>
                </div>

                <div
                  className={`${styles.timelineStep} ${
                    ["processing", "ready", "picked", "shipped", "delivered"].includes(
                      selectedOrder.status
                    )
                      ? styles.completed
                      : ""
                  } ${["cancelled"].includes(selectedOrder.status)?styles.incompleted :"" }`}
                >
                  <div className={styles.stepIcon}>
                    {selectedOrder.status === "cancelled" ? (
                      <AiOutlineCloseCircle />
                    ) : (
                      <BsGear />
                    )}
                  </div>
                  <div className={styles.stepContent}>
                    <h4>
                      {selectedOrder.status === "cancelled"
                        ? "Cancelled"
                        : "Processing"}
                    </h4>
                    {selectedOrder.status === "cancelled" ? (
                      <p>
                        {selectedOrder.cancelledDate
                          ? formatDateTime(new Date(selectedOrder.cancelledDate))
                          : "N/A"}
                      </p>
                    ) : ["processing", "ready", "picked", "shipped", "delivered", "cancelled"].includes(
                      selectedOrder.status
                    ) ? (
                      <p>
                        {selectedOrder.processedDate
                          ? formatDateTime(new Date(selectedOrder.processedDate))
                          : "N/A"}
                      </p>
                    ) : (
                      <p>Pending</p>
                    )}
                  </div>
                </div>

                {selectedOrder.status !== "cancelled" && (
                  <>
                    {selectedOrder.delivery === "home" ? (
                      <>
                        <div
                          className={`${styles.timelineStep} ${
                            ["shipped", "delivered"].includes(selectedOrder.status)
                              ? styles.completed
                              : ""
                          }`}
                        >
                          <div className={styles.stepIcon}>
                            <BsTruck />
                          </div>
                          <div className={styles.stepContent}>
                            <h4>Shipped</h4>
                            {["shipped", "delivered"].includes(
                              selectedOrder.status
                            ) ? (
                              <>
                                <p>
                                  {formatDateTime(
                                    new Date(selectedOrder.shippedDate)
                                  )}
                                </p>
                                {selectedOrder.tracking && (
                                  <p className={styles.tracking}>
                                    Tracking: <span>{selectedOrder.tracking}</span>
                                  </p>
                                )}
                              </>
                            ) : (
                              <p>Pending</p>
                            )}
                          </div>
                        </div>
                        <div
                          className={`${styles.timelineStep} ${
                            selectedOrder.status === "delivered"
                              ? styles.completed
                              : ""
                          } `}
                        >
                          <div className={styles.stepIcon}>
                            <BsCheckCircle />
                          </div>
                          <div className={styles.stepContent}>
                            <h4>Delivered</h4>
                            {selectedOrder.status === "delivered" ? (
                              <p>
                                {formatDateTime(
                                  new Date(selectedOrder.deliveredDate)
                                )}
                              </p>
                            ) : (
                              <p>Pending</p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`${styles.timelineStep} ${
                            ["ready", "picked"].includes(selectedOrder.status)
                              ? styles.completed
                              : ""
                          }`}
                        >
                          <div className={styles.stepIcon}>
                            <BsBoxSeam />
                          </div>
                          <div className={styles.stepContent}>
                            <h4>Ready for Pickup</h4>
                            {["ready", "picked"].includes(selectedOrder.status) ? (
                              <>
                                <p>
                                  {formatDateTime(new Date(selectedOrder.readyDate))}
                                </p>
                                <p className={styles.tracking}>
                                  Store: <span>{selectedOrder.pickupLocation}</span>
                                </p>
                              </>
                            ) : (
                              <p>Pending</p>
                            )}
                          </div>
                        </div>
                        <div
                          className={`${styles.timelineStep} ${
                            selectedOrder.status === "picked"
                              ? styles.completed
                              : ""
                          }`}
                        >
                          <div className={styles.stepIcon}>
                            <AiOutlineShopping />
                          </div>
                          <div className={styles.stepContent}>
                            <h4>Picked Up</h4>
                            {selectedOrder.status === "picked" ? (
                              <p>
                                {formatDateTime(new Date(selectedOrder.pickedDate))}
                              </p>
                            ) : (
                              <p>Pending</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {selectedOrder.delivery === "pickup" &&
                selectedOrder.status === "ready" && (
                  <div className={styles.notificationBanner}>
                    <BsBellFill /> Order is ready for pickup at{" "}
                    {selectedOrder.pickupLocation}
                  </div>
                )}

              <div className={styles.orderDetailsGrid}>
                <div className={styles.detailSection}>
                  <h3>
                    <RiNotificationBadgeLine /> Customer Information
                  </h3>
                  <div className={styles.detailContent}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Name:</span>
                      <span className={styles.detailValue}>
                        {selectedOrder.customer}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>
                        {selectedOrder.email}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Phone:</span>
                      <span className={styles.detailValue}>
                        {selectedOrder.contact}
                      </span>
                    </div>
                    {selectedOrder.delivery === "home" && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Address:</span>
                        <span className={styles.detailValue}>
                          {selectedOrder.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h3>
                    <BsBoxSeam /> Order Information
                  </h3>
                  <div className={styles.detailContent}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Order Date:</span>
                      <span className={styles.detailValue}>
                        {formatDateTime(new Date(selectedOrder.date))}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        Delivery Method:
                      </span>
                      <span className={styles.detailValue}>
                        {selectedOrder.delivery === "home"
                          ? "Home Delivery"
                          : "Store Pickup"}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        Payment Method:
                      </span>
                      <span className={styles.detailValue}>
                        {selectedOrder.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : "bKash"}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        Payment Status:
                      </span>
                      <span
                        className={`${styles.detailValue} ${
                          styles[selectedOrder.payment]
                        }`}
                      >
                        {selectedOrder.payment === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.delivery === "pickup" && (
                  <div className={styles.detailSection}>
                    <h3>
                      <BsShop /> Pickup Information
                    </h3>
                    <div className={styles.detailContent}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Store:</span>
                        <span className={styles.detailValue}>
                          {selectedOrder.pickupLocation}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Pickup Hours:</span>
                        <span className={styles.detailValue}>
                          10:00 AM - 8:00 PM (Daily)
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Contact:</span>
                        <span className={styles.detailValue}>
                          {selectedOrder.storeContact || "Store Phone Number"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${styles.detailSection} ${styles.fullWidth}`}>
                  <h3>
                    <MdOutlineLocalShipping /> Order Items (
                    {selectedOrder.items.length})
                  </h3>
                  <div className={styles.itemsTableContainer}>
                    <table className={styles.itemsTable}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>৳{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>৳{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h3>
                    <MdOutlinePayment /> Order Summary
                  </h3>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal:</span>
                      <span>৳{selectedOrder.total}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Delivery Charge:</span>
                      <span>
                        ৳{selectedOrder.delivery === "home" ? "50" : "0"}
                      </span>
                    </div>
                    {selectedOrder.status === "cancelled" && selectedOrder.payment === "paid" && (
                      <div className={styles.summaryRow}>
                        <span>Refund Amount:</span>
                        <span>
                          -৳
                          {selectedOrder.refundAmount || 
                            (selectedOrder.total + (selectedOrder.delivery === "home" ? 50 : 0))}
                        </span>
                      </div>
                    )}
                    <div className={styles.summaryTotal}>
                      <span>Total:</span>
                      <span>
                        ৳
                        {selectedOrder.total +
                          (selectedOrder.delivery === "home" ? 50 : 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.detailSection} ${styles.fullWidth}`}>
                  <h3>Order Actions</h3>
                  <div className={styles.actionButtonsContainer}>
                    <div className={styles.statusSelectContainer}>
                      <select
                        className={styles.statusSelect}
                        value={selectedOrder.status}
                        onChange={(e) =>
                          updateOrderStatus(selectedOrder.id, e.target.value)
                        }
                      >
                        {selectedOrder.status === "cancelled" ? (
                          <option value="cancelled">Cancelled</option>
                        ) : (
                          <>
                            <option value="Order Placed">New Order</option>
                            <option value="processing">Processing</option>
                            {selectedOrder.delivery === "home" ? (
                              <>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </>
                            ) : (
                              <>
                                <option value="ready">Ready for Pickup</option>
                                <option value="picked">Picked Up</option>
                              </>
                            )}
                            <option value="cancelled">Cancel Order</option>
                          </>
                        )}
                      </select>
                      <div className={styles.selectArrow}>
                        <FiChevronRight />
                      </div>
                    </div>

                    <div className={styles.actionButtonGroup}>
                      <button
                        className={styles.actionButton}
                        onClick={handlePrintInvoice}
                      >
                        <FiPrinter /> Print
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={handleEmailCustomer}
                      >
                        <FiMail /> Email
                      </button>
                      {selectedOrder.status === "cancelled" && selectedOrder.payment === "paid" && (
                        <button
                          className={styles.actionButton}
                          onClick={handleProcessRefund}
                        >
                          <FiDollarSign /> Refund
                        </button>
                      )}
                      {selectedOrder.originalState && (
                        <button
                          className={styles.actionButton}
                          onClick={() => revertToOriginalState(selectedOrder.id)}
                        >
                          <FiRefreshCw /> Revert to Original
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;