import React, { useState, useEffect, useRef, useContext } from "react";
import {
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineShopping,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { jsPDF } from "jspdf";
import {
  BsTruck,
  BsBoxSeam,
  BsShop,
  BsGear,
  BsBellFill,
  BsBox,
} from "react-icons/bs";
import { UserContext } from "../UserContext";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { MdOutlineLocalShipping, MdOutlinePayment } from "react-icons/md";
import { FiPrinter, FiMail } from "react-icons/fi";
import * as htmlToImage from "html-to-image";
import styles from "./CurrentOrderPage.module.css";
import Notification from "./Notification";

const CurrentOrderPage = () => {
  const { searchItem } = useContext(UserContext);
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
          order.items = order.items || [];
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

  const contentRef = useRef();
  const exportPDF = () => {
    if (!selectedOrder) {
      showNotif("No order selected.", "error");
      return;
    }

    try {
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      });

      // Set fonts and colors for professional look
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.text("Order Details", 40, 60);

      // Invoice details header
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Order ID: ${selectedOrder.id}`, 40, 80);
      doc.text(`Date: ${formatDateTime(new Date(selectedOrder.date))}`, 40, 95);

      // Company info (assuming a placeholder company)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Online Shop", 400, 40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Company Address", 400, 55);
      doc.text("City, State, ZIP", 400, 70);
      doc.text("Phone: +123-456-7890", 400, 85);
      doc.text("Email: info@company.com", 400, 100);

      // Bill To section
      doc.setDrawColor(200, 200, 200);
      doc.line(40, 120, 555, 120); // Horizontal line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Bill To:", 40, 140);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Name: ${selectedOrder.customer}`, 40, 155);
      doc.text(`Email: ${selectedOrder.email}`, 40, 170);
      doc.text(`Phone: ${selectedOrder.contact}`, 40, 185);
      if (selectedOrder.deliveryMethod === "home") {
        doc.text(`Address: ${selectedOrder.address}`, 40, 200);
      } else {
        doc.text(`Pickup Location: Mirpur-10, Dhaka`, 40, 200);
      }

      // Order Information
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Order Information:", 300, 140);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Delivery Method: ${selectedOrder.deliveryMethod === "home" ? "Home Delivery" : "Store Pickup"}`, 300, 155);
      doc.text(`Payment Method: ${selectedOrder.paymentMethod === "COD" ? "Cash on Delivery" : "bKash"}`, 300, 170);
      doc.text(`Payment Status: ${selectedOrder.payment === "Paid" ? "Paid" : "Pending"}`, 300, 185);
      doc.text(`Status: ${selectedOrder.status ? (selectedOrder.status === "ready" ? "Ready for Pickup" : selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)) : "N/A"}`, 300, 200);

      // Draw another line
      doc.line(40, 220, 555, 220);

      // Items Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Order Items:", 40, 240);

      // Table headers
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setDrawColor(150, 150, 150);
      doc.setFillColor(240, 240, 240);
      doc.rect(40, 250, 515, 15, "F"); // Header background
      doc.text("Product", 45, 260);
      doc.text("Color", 200, 260);
      doc.text("Size", 280, 260);
      doc.text("Price (BDT)", 350, 260);
      doc.text("Qty", 420, 260);
      doc.text("Total (BDT)", 480, 260);

      // Table rows
      doc.setFont("helvetica", "normal");
      let yPos = 265;
      selectedOrder.items.forEach((item, index) => {
        const rowColor = index % 2 === 0 ? 255 : 245;
        doc.setFillColor(rowColor, rowColor, rowColor);
        doc.rect(40, yPos, 515, 15, "F");
        doc.text(item.name || "N/A", 45, yPos + 10);
        doc.text(item.color || "N/A", 200, yPos + 10);
        doc.text(item.size || "N/A", 280, yPos + 10);
        doc.text(item.price ? `${item.price}` : "N/A", 350, yPos + 10);
        doc.text(`${item.quantity || 0}`, 420, yPos + 10);
        doc.text(`${item.price * item.quantity || 0}`, 480, yPos + 10);
        yPos += 15;
      });

      // Draw table borders
      doc.setDrawColor(200, 200, 200);
      doc.rect(40, 250, 515, yPos - 250); // Outer border
      // Vertical lines
      doc.line(195, 250, 195, yPos);
      doc.line(275, 250, 275, yPos);
      doc.line(345, 250, 345, yPos);
      doc.line(415, 250, 415, yPos);
      doc.line(475, 250, 475, yPos);

      // Order Summary
      yPos += 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Order Summary:", 40, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      yPos += 15;
      doc.text("Subtotal:", 400, yPos);
      doc.text(`${selectedOrder.total} BDT`, 480, yPos);
      yPos += 15;
      doc.text("Delivery Charge:", 400, yPos);
      doc.text(`${selectedOrder.deliveryMethod === "home" ? 50 : 0} BDT`, 480, yPos);
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 400, yPos);
      doc.text(`${selectedOrder.total + (selectedOrder.deliveryMethod === "home" ? 50 : 0)} BDT`, 480, yPos);

      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.line(40, 760, 555, 760);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for your business!", 40, 780);
      doc.text("If you have any questions, contact us at onlineshop@company.com", 40, 795);

      // Page number
      doc.text(`Page 1 of 1`, 555 / 2, 810, { align: "center" });

      doc.save(`invoice_${selectedOrder.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotif("Failed to generate PDF. Please try again.", "error");
    }
  };

  const handlePrintInvoice = () => {
    exportPDF();
  };

  const handleEmailCustomer = () => {
    alert(`Invoice will be sent to ${selectedOrder.email}`);
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.id ? order.id.toString().toLowerCase() : "").includes(
        searchItem.toLowerCase()
      ) || order.customer.toLowerCase().includes(searchItem.toLowerCase())
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

        {/* <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div> */}

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
                    <BsShop /> Mirpur-10, Dhaka
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
      <div ref={contentRef} className={styles.orderDetailModal}>
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
                    {selectedOrder.payment === "Paid" ? "Paid" : "Pending"}
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
                      Mirpur-10, Dhaka
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
                      {selectedOrder.storeContact || "01712345678"}
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
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.item_id}>
                          <td>{item.name || 'N/A'}</td>
                          <td>{item.color || 'N/A'}</td>
                          <td>{item.size || 'N/A'}</td>
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