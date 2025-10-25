import React, { useState, useEffect } from "react";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import Notification from "./Notification";
import ConfirmModal from "./ConfirmModal";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // Helper function to calculate discounted price
  const getPrice = (item) => {
    const price = item.price || 0; // Fallback to 0 if price is missing
    const discount = item.discount || 0; // Fallback to 0 if discount is missing
    return price - (price * discount) / 100;
  };

  const handleQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/get-all-cart-item",
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
        setCartItems(data);
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemove = (id) => {
    setItemToRemove(id);
    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    if (itemToRemove) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemToRemove));
      try {
        const response = await fetch(
          `http://localhost:8080/remove-cart-item/${itemToRemove}`,
          {
            method: "DELETE",
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

        showNotif("Item removed from cart successfully", "success");
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error removing item from cart:", error);
      }
    }
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const cancelRemove = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const handleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every((item) => item.selected);
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + getPrice(item) * item.quantity,
    0
  );
  const delivery = subtotal > 1000 ? 0 : 50;
  const total = subtotal + delivery;
  const discount = selectedItems.reduce(
    (sum, item) => sum + (item.price - getPrice(item)) * item.quantity,
    0
  );

  return (
    <div className={styles.cartWrapper}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      <h1 className={styles.heading}>
        <FaCartArrowDown style={{ fontSize: "2.5rem" }} /> My Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty!</p>
          <Link to="/" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            <div className={styles.selectAll}>
              <input
                type="checkbox"
                checked={
                  cartItems.length > 0 &&
                  cartItems.every((item) => item.selected)
                }
                onChange={handleSelectAll}
                id="selectAll"
              />
              <label htmlFor="selectAll">
                Select all items ({cartItems.length})
              </label>
            </div>

            {cartItems.map((item) => {
              const price = getPrice(item);
              const totalPrice = price * item.quantity;
              const totalOriginal =
                item.price && item.quantity ? item.price * item.quantity : 0;
              const totalDiscount = totalOriginal - totalPrice;

              return (
                <div
                  key={item.id}
                  className={`${styles.cartItem} ${
                    item.selected ? styles.selectedItem : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleSelect(item.id)}
                    className={styles.itemCheckbox}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.productImage}
                  />
                  <div className={styles.cartItemDetailsWithDelete}>
                    <div className={styles.cartItemDetailsContent}>
                      <Link
                        to={`/product/${item.productId}`}
                        state={{ id: `${item.productId}`}}
                        className={styles.itemLink}
                        key={item.id}
                      >
                        <h2 className={styles.itemTitle}>{item.name}</h2>
                      </Link>
                      <p className={styles.itemMeta}>
                        Size: {item.size || "N/A"}
                      </p>
                      <div className={styles.priceContainer}>
                        <span className={styles.price}>
                          ৳{totalPrice.toFixed(2)}
                        </span>
                        {item.discount !== 0 && (
                          <span className={styles.originalPrice}>
                            <s>৳{totalOriginal.toFixed(2)}</s>
                          </span>
                        )}
                        {item.discount !== 0 && (
                          <span className={styles.discountBadge}>
                            Save ৳{totalDiscount.toFixed(2)} (
                            {Math.round(item.discount)}% OFF)
                          </span>
                        )}
                      </div>
                      <div className={styles.qtyControl}>
                        <button
                          onClick={() => handleQuantity(item.id, "dec")}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantity(item.id, "inc")}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove item"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <h3>Order Summary</h3>
            {selectedItems.length === 0 ? (
              <p className={styles.noItemsSelected}>
                No items selected. Please select items to proceed.
              </p>
            ) : (
              <>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Discount</span>
                    <span className={styles.discount}>
                      -৳{discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span>Delivery</span>
                  <span>{delivery === 0 ? "FREE" : `৳${delivery}`}</span>
                </div>
                <div className={styles.total}>
                  <span>Total </span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
                <Link
                  to="/CheckoutPage"
                  state={{ cartItems: selectedItems }}
                  className={styles.checkoutLink}
                >
                  <button className={styles.checkoutBtn}>
                    ✅ Proceed to Checkout
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        title="Confirm Removal"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CartPage;