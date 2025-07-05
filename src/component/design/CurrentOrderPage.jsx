import React, { useState, useEffect } from "react";
import {
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineShopping,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import {
  BsTruck,
  BsBoxSeam,
  BsShop,
  BsGear,
  BsBellFill,
  BsBox,
} from "react-icons/bs";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { MdOutlineLocalShipping, MdOutlinePayment } from "react-icons/md";
import { FiPrinter, FiMail } from "react-icons/fi";
import styles from "./CurrentOrderPage.module.css";
import Notification from "./Notification";

const CurrentOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/get-all-order-item",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        const data = await response.json();
        console.log(data);
        // Ensure items is always an array
        data.forEach((order) => {
          order.items = order.items || []; // If order.items is undefined, set it to an empty array
        });
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        showNotif(error.message, "error");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleEmailCustomer = () => {
    alert(`Invoice will be sent to ${selectedOrder.email}`);
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.id ? order.id.toString().toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) || order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    if (!status) return styles.default;

    switch (status.toLowerCase()) {
      case "delivered":
      case "picked":
        return styles.success;
      case "shipped":
      case "ready":
        return styles.info;
      case "processing":
        return styles.warning;
      case "cancelled":
        return styles.danger;
      default:
        return styles.default;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading your orders...</div>;
  }

  if (!selectedOrder) {
    return (
      <div className={styles.orderTrackingContainer}>
        <h1 className={styles.pageTitle}>Your Orders</h1>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.noOrders}>No orders found</div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={styles.orderCard}
                onClick={() => setSelectedOrder(order)}
              >
                <div className={styles.orderCardHeader}>
                  <h3>Order #{order.id}</h3>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status
                      ? order.status === "ready"
                        ? "Ready for Pickup"
                        : order.status === "picked"
                        ? "Picked Up"
                        : order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                      : "N/A"}
                  </span>
                </div>

                <div className={styles.orderCardDetails}>
                  <div>
                    <span className={styles.detailLabel}>Date:</span>
                    <span>{formatDateTime(new Date(order.date))}</span>
                  </div>
                  <div>
                    <span className={styles.detailLabel}>Total:</span>
                    <span>
                      ৳{order.total + (order.deliveryMethod === "home" ? 50 : 0)}
                    </span>
                  </div>
                  <div>
                    <span className={styles.detailLabel}>Items:</span>
                    <span>{order.items ? order.items.length : 0}</span>
                  </div>
                </div>

                {order.deliveryMethod === "home" && order.tracking && (
                  <div className={styles.trackingInfo}>
                    <BsTruck /> Tracking: {order.tracking}
                  </div>
                )}

                {order.deliveryMethod === "pickup" && (
                  <div className={styles.pickupInfo}>
                    <BsShop /> {order.pickupLocation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className={styles.orderDetailModal}>
        <div className={styles.modalHeader}>
          <h2>Order ID: {selectedOrder.id}</h2>
          <div className={styles.modalActions}>
            <button
              className={styles.closeModal}
              onClick={() => setSelectedOrder(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>

        <div className={styles.modalContent}>
          {/* Order Status Timeline */}
          <div
            className={`${styles.statusTimeline} ${
              selectedOrder.deliveryMethod === "pickup" ? styles.pickupTimeline : ""
            }`}
          >
            {/* Order Placed - Common for both */}
            <div className={`${styles.timelineStep} ${styles.completed}`}>
              <div className={styles.stepIcon}>
                <AiOutlineClockCircle />
              </div>
              <div className={styles.stepContent}>
                <h4>Order Placed</h4>
                <p>{formatDateTime(new Date(selectedOrder.date))}</p>
              </div>
            </div>

            {/* Processing - Common for both */}
            <div
              className={`${styles.timelineStep} ${
                [
                  "processing",
                  "ready",
                  "picked",
                  "shipped",
                  "delivered",
                ].includes(selectedOrder.status)
                  ? styles.completed
                  : ""
              } ${
                ["cancelled"].includes(selectedOrder.status)
                  ? styles.incompleted
                  : ""
              }`}
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
                ) : [
                    "processing",
                    "ready",
                    "picked",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].includes(selectedOrder.status) ? (
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

            {/* Dynamic Step based on Delivery Method */}
            {selectedOrder.status !== "cancelled" && (
              <>
                {selectedOrder.deliveryMethod === "home" ? (
                  /* Home Delivery Flow */
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
                      }`}
                    >
                      <div className={styles.stepIcon}>
                        <AiOutlineCheckCircle />
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
                  /* Store Pickup Flow */
                  <>
                    <div
                      className={`${styles.timelineStep} ${
                        ["ready", "picked"].includes(selectedOrder.status)
                          ? styles.completed
                          : ""
                      }`}
                    >
                      <div className={styles.stepIcon}>
                        <BsBox />
                      </div>
                      <div className={styles.stepContent}>
                        <h4>Ready for Pickup</h4>
                        {["ready", "picked"].includes(selectedOrder.status) ? (
                          <>
                            <p>
                              {formatDateTime(
                                new Date(selectedOrder.readyDate)
                              )}
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

          {selectedOrder.deliveryMethod === "pickup" &&
            selectedOrder.status === "ready" && (
              <div className={styles.notificationBanner}>
                <BsBellFill /> Your order is ready for pickup! Please bring your
                ID and order confirmation.
              </div>
            )}

          <div className={styles.orderDetailsGrid}>
            {/* Customer Information */}
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
                {selectedOrder.deliveryMethod === "home" && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Address:</span>
                    <span className={styles.detailValue}>
                      {selectedOrder.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Information */}
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
                  <span className={styles.detailLabel}>Delivery Method:</span>
                  <span className={styles.detailValue}>
                    {selectedOrder.deliveryMethod === "home"
                      ? "Home Delivery"
                      : "Store Pickup"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Method:</span>
                  <span className={styles.detailValue}>
                    {selectedOrder.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "bKash"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Status:</span>
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

            {/* Pickup Information (for store pickup) */}
            {selectedOrder.deliveryMethod === "pickup" && (
              <div className={styles.detailSection}>
                <h3>
                  <BsShop /> Pickup Information
                </h3>
                <div className={styles.detailContent}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Store Location:</span>
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

            {/* Order Items */}
            <div className={`${styles.detailSection} ${styles.fullWidth}`}>
              <h3>
                <MdOutlineLocalShipping /> Order Items (
                {selectedOrder.items.length})
              </h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
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
                        <tr key={item.item_id}>
                          <td>{item.name || 'N/A'}</td>
                          <td>{item.price ? `৳${item.price}` : 'N/A'}</td>
                          <td>{item.quantity || 0}</td>
                          <td>{item.price * item.quantity || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.noItems}>No items available</div>
              )}
            </div>

            {/* Order Summary */}
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
                  <span>৳{selectedOrder.deliveryMethod === "home" ? "50" : "0"}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total:</span>
                  <span>
                    ৳
                    {selectedOrder.total +
                      (selectedOrder.deliveryMethod === "home" ? 50 : 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Actions (Customer-facing) */}
            <div className={`${styles.detailSection} ${styles.fullWidth}`}>
              <div className={styles.actionButtonGroup}>
                <button
                  className={styles.actionButton}
                  onClick={handlePrintInvoice}
                >
                  <FiPrinter /> Print Invoice
                </button>
                <button
                  className={styles.actionButton}
                  onClick={handleEmailCustomer}
                >
                  <FiMail /> Email Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentOrderPage;
