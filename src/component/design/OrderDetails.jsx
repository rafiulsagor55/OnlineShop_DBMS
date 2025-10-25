import React, { useState, useEffect } from "react";
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
import { RiNotificationBadgeLine } from "react-icons/ri";
import { MdOutlineLocalShipping, MdOutlinePayment } from "react-icons/md";
import { FiPrinter, FiMail } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import styles from "./OrderDetails.module.css";
import Notification from "./Notification";

const OrderDetails = ({ id, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/get-order-item/${id}`,
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
        data.items = data.items || [];
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        showNotif(error.message, "error");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportPDF = () => {
    if (!order) {
      showNotif("No order available.", "error");
      return;
    }

    try {
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.text("Order Details", 40, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Order ID: ${order.id}`, 40, 80);
      doc.text(`Date: ${formatDateTime(order.date)}`, 40, 95);

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

      doc.setDrawColor(200, 200, 200);
      doc.line(40, 120, 555, 120);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Bill To:", 40, 140);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Name: ${order.customer}`, 40, 155);
      doc.text(`Email: ${order.email}`, 40, 170);
      doc.text(`Phone: ${order.contact}`, 40, 185);
      doc.text(
        order.deliveryMethod === "home"
          ? `Address: ${order.address}`
          : `Pickup Location: Mirpur-10, Dhaka`,
        40,
        200
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Order Information:", 300, 140);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        `Delivery Method: ${
          order.deliveryMethod === "home" ? "Home Delivery" : "Store Pickup"
        }`,
        300,
        155
      );
      doc.text(
        `Payment Method: ${order.paymentMethod === "COD" ? "Cash on Delivery" : "bKash"}`,
        300,
        170
      );
      doc.text(
        `Payment Status: ${order.payment === "Paid" ? "Paid" : "Pending"}`,
        300,
        185
      );
      doc.text(
        `Status: ${
          order.status
            ? order.status === "ready"
              ? "Ready for Pickup"
              : order.status.charAt(0).toUpperCase() + order.status.slice(1)
            : "N/A"
        }`,
        300,
        200
      );

      doc.line(40, 220, 555, 220);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Order Items:", 40, 240);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setDrawColor(150, 150, 150);
      doc.setFillColor(240, 240, 240);
      doc.rect(40, 250, 515, 15, "F");
      doc.text("Product", 45, 260);
      doc.text("Color", 200, 260);
      doc.text("Size", 280, 260);
      doc.text("Price (BDT)", 350, 260);
      doc.text("Qty", 420, 260);
      doc.text("Total (BDT)", 480, 260);

      doc.setFont("helvetica", "normal");
      let yPos = 265;
      order.items.forEach((item, index) => {
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

      doc.setDrawColor(200, 200, 200);
      doc.rect(40, 250, 515, yPos - 250);
      doc.line(195, 250, 195, yPos);
      doc.line(275, 250, 275, yPos);
      doc.line(345, 250, 345, yPos);
      doc.line(415, 250, 415, yPos);
      doc.line(475, 250, 475, yPos);

      yPos += 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Order Summary:", 40, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      yPos += 15;
      doc.text("Subtotal:", 400, yPos);
      doc.text(`${order.total} BDT`, 480, yPos);
      yPos += 15;
      doc.text("Delivery Charge:", 400, yPos);
      doc.text(`${order.deliveryMethod === "home" ? 50 : 0} BDT`, 480, yPos);
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 400, yPos);
      doc.text(
        `${order.total + (order.deliveryMethod === "home" ? 50 : 0)} BDT`,
        480,
        yPos
      );

      doc.setDrawColor(200, 200, 200);
      doc.line(40, 760, 555, 760);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for your business!", 40, 780);
      doc.text(
        "If you have any questions, contact us at onlineshop@company.com",
        40,
        795
      );

      doc.text(`Page 1 of 1`, 555 / 2, 810, { align: "center" });

      doc.save(`invoice_${order.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotif("Failed to generate PDF. Please try again.", "error");
    }
  };

  const handlePrintInvoice = () => {
    exportPDF();
  };

  const handleEmailCustomer = () => {
    alert(`Invoice will be sent to ${order.email}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading order details...</div>;
  }

  if (!order) {
    return <div className={styles.noOrders}>No order found</div>;
  }

  return (
    <div className={styles.orderDetailContainer}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className={styles.modalHeader}>
        <h2>Order ID: {order.id}</h2>
        <button
          className={styles.closeModal}
          onClick={onClose}
          aria-label="Close order details"
        >
          <RxCross1 />
        </button>
      </div>

      <div className={styles.modalContent}>
        <div
          className={`${styles.statusTimeline} ${
            order.deliveryMethod === "pickup" ? styles.pickupTimeline : ""
          }`}
        >
          <div className={`${styles.timelineStep} ${styles.completed}`}>
            <div className={styles.stepIcon}>
              <AiOutlineClockCircle />
            </div>
            <div className={styles.stepContent}>
              <h4>Order Placed</h4>
              <p>{formatDateTime(order.date)}</p>
            </div>
          </div>

          <div
            className={`${styles.timelineStep} ${
              ["processing", "ready", "picked", "shipped", "delivered"].includes(
                order.status
              )
                ? styles.completed
                : ""
            } ${["cancelled"].includes(order.status) ? styles.incompleted : ""}`}
          >
            <div className={styles.stepIcon}>
              {order.status === "cancelled" ? (
                <AiOutlineCloseCircle />
              ) : (
                <BsGear />
              )}
            </div>
            <div className={styles.stepContent}>
              <h4>{order.status === "cancelled" ? "Cancelled" : "Processing"}</h4>
              {order.status === "cancelled" ? (
                <p>
                  {order.cancelledDate
                    ? formatDateTime(order.cancelledDate)
                    : "N/A"}
                </p>
              ) : ["processing", "ready", "picked", "shipped", "delivered"].includes(
                  order.status
                ) ? (
                <p>
                  {order.processedDate
                    ? formatDateTime(order.processedDate)
                    : "N/A"}
                </p>
              ) : (
                <p>Pending</p>
              )}
            </div>
          </div>

          {order.status !== "cancelled" && (
            <>
              {order.deliveryMethod === "home" ? (
                <>
                  <div
                    className={`${styles.timelineStep} ${
                      ["shipped", "delivered"].includes(order.status)
                        ? styles.completed
                        : ""
                    }`}
                  >
                    <div className={styles.stepIcon}>
                      <BsTruck />
                    </div>
                    <div className={styles.stepContent}>
                      <h4>Shipped</h4>
                      {["shipped", "delivered"].includes(order.status) ? (
                        <>
                          <p>{formatDateTime(order.shippedDate)}</p>
                          {order.tracking && (
                            <p className={styles.tracking}>
                              Tracking: <span>{order.tracking}</span>
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
                      order.status === "delivered" ? styles.completed : ""
                    }`}
                  >
                    <div className={styles.stepIcon}>
                      <AiOutlineCheckCircle />
                    </div>
                    <div className={styles.stepContent}>
                      <h4>Delivered</h4>
                      {order.status === "delivered" ? (
                        <p>{formatDateTime(order.deliveredDate)}</p>
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
                      ["ready", "picked"].includes(order.status)
                        ? styles.completed
                        : ""
                    }`}
                  >
                    <div className={styles.stepIcon}>
                      <BsBox />
                    </div>
                    <div className={styles.stepContent}>
                      <h4>Ready for Pickup</h4>
                      {["ready", "picked"].includes(order.status) ? (
                        <>
                          <p>{formatDateTime(order.readyDate)}</p>
                          <p className={styles.tracking}>
                            Store: <span>Mirpur-10, Dhaka</span>
                          </p>
                        </>
                      ) : (
                        <p>Pending</p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${styles.timelineStep} ${
                      order.status === "picked" ? styles.completed : ""
                    }`}
                  >
                    <div className={styles.stepIcon}>
                      <AiOutlineShopping />
                    </div>
                    <div className={styles.stepContent}>
                      <h4>Picked Up</h4>
                      {order.status === "picked" ? (
                        <p>{formatDateTime(order.pickedDate)}</p>
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

        {order.deliveryMethod === "pickup" && order.status === "ready" && (
          <div className={styles.notificationBanner}>
            <BsBellFill /> Your order is ready for pickup! Please bring your ID and
            order confirmation.
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
                <span className={styles.detailValue}>{order.customer}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{order.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Phone:</span>
                <span className={styles.detailValue}>{order.contact}</span>
              </div>
              {order.deliveryMethod === "home" && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Address:</span>
                  <span className={styles.detailValue}>{order.address}</span>
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
                  {formatDateTime(order.date)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Delivery Method:</span>
                <span className={styles.detailValue}>
                  {order.deliveryMethod === "home" ? "Home Delivery" : "Store Pickup"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment Method:</span>
                <span className={styles.detailValue}>
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "bKash"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment Status:</span>
                <span
                  className={`${styles.detailValue} ${styles[order.payment]}`}
                >
                  {order.payment === "Paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {order.deliveryMethod === "pickup" && (
            <div className={styles.detailSection}>
              <h3>
                <BsShop /> Pickup Information
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Store Location:</span>
                  <span className={styles.detailValue}>Mirpur-10, Dhaka</span>
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
                    {order.storeContact || "01712345678"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={`${styles.detailSection} ${styles.fullWidth}`}>
            <h3>
              <MdOutlineLocalShipping /> Order Items ({order.items.length})
            </h3>
            {order.items && order.items.length > 0 ? (
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
                    {order.items.map((item) => (
                      <tr key={item.item_id}>
                        <td>{item.name || "N/A"}</td>
                        <td>{item.color || "N/A"}</td>
                        <td>{item.size || "N/A"}</td>
                        <td>{item.price ? `৳${item.price}` : "N/A"}</td>
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

          <div className={styles.detailSection}>
            <h3>
              <MdOutlinePayment /> Order Summary
            </h3>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>৳{order.total}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Charge:</span>
                <span>৳{order.deliveryMethod === "home" ? "50" : "0"}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total:</span>
                <span>
                  ৳{order.total + (order.deliveryMethod === "home" ? 50 : 0)}
                </span>
              </div>
            </div>
          </div>

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
  );
};

export default OrderDetails;