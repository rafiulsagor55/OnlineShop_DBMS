import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MdDelete, MdArrowBack } from 'react-icons/md';
import { FaStoreAlt, FaShippingFast, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import styles from './CheckoutPage.module.css';
import Notification from './Notification';

const CheckoutPage = () => {
  const location = useLocation();
  const initialCartItems = location.state?.cartItems || [];

  const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("info");
  
    const showNotif = (message, type = "info") => {
      setNotificationMessage(message);
      setNotificationType(type);
      setShowNotification(true);
    };
  
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryMethod: 'home',
    paymentMethod: 'COD',
    note: '',
  });

  // Price calculation functions
  const getPrice = (item) => {
    const price = item.price || 0;
    const discount = item.discount || 0;
    return price - (price * discount) / 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Construct the order object
  const orderData = {
    id: '',
    date:'',
    status: '', // Or set based on your business logic
    customer: formData.name,
    email: formData.email,
    contact: formData.phone,
    address: formData.address,
    deliveryMethod: formData.deliveryMethod,
    paymentMethod: formData.paymentMethod,
    payment: '',
    processedDate: '',
    shippedDate: '',
    deliveredDate: '', 
    readyDate:'',
    pickedDate:'',
    items: cartItems.map(item => ({
      productId: item.productId,
      name: '',
      color: item.color,
      size: item.size,
      price: '',
      quantity: item.quantity,
    })),
    total: '', 
  };

  // Send the order data to your backend
  try {
  const response =await fetch('http://localhost:8080/save-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
    credentials: "include",
  })
    if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        const data = await (await response).text();
        showNotif(data, "success");
      } catch (error) {
        showNotif(error.message, "error");
        console.error("Error fetching cart items:", error);
      }
};


  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate order totals
  const deliveryCharge = formData.deliveryMethod === 'pickup' ? 0 : 50;
  const subtotal = cartItems.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0);
  const total = subtotal + deliveryCharge;
  const discount = cartItems.reduce((sum, item) => sum + (item.price - getPrice(item)) * item.quantity, 0);

  return (
    <div className={styles.checkoutWrapper}>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className={styles.header}>
        <Link to="/cartPage" className={styles.backButton}>
          <MdArrowBack className={styles.backIcon} />
          Back to Cart
        </Link>
        <h1 className={styles.checkoutTitle}>Secure Checkout</h1>
      </div>

      <div className={styles.checkoutGrid}>
        {/* Order Summary Section */}
        <section className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.summaryTitle}>
              Order Summary <span>({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
            </h2>
          </div>

          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIllustration}></div>
              <p>Your cart is empty</p>
              <Link to="/products" className={styles.continueShopping}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.itemsList}>
                {cartItems.map(item => {
                  const price = getPrice(item);
                  const totalPrice = price * item.quantity;
                  const totalOriginal = item.price * item.quantity;
                  const totalDiscount = totalOriginal - totalPrice;

                  return (
                    <article key={item.id} className={styles.cartItem}>
                      <div className={styles.itemMedia}>
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        {item.size && <p className={styles.itemVariant}>Size: {item.size}</p>}
                        
                        <div className={styles.priceContainer}>
                          <span className={styles.currentPrice}>৳{price.toFixed(2)}</span>
                          {item.discount > 0 && (
                            <span className={styles.originalPrice}>৳{item.price.toFixed(2)}</span>
                          )}
                          {item.discount > 0 && (
                            <span className={styles.discountBadge}>
                              {Math.round(item.discount)}% OFF
                            </span>
                          )}
                        </div>

                        <div className={styles.itemActions}>
                          <div className={styles.quantityControl}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={styles.quantityButton}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className={styles.quantityValue}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={styles.quantityButton}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className={styles.removeButton}
                            aria-label="Remove item"
                          >
                            <MdDelete className={styles.deleteIcon} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.itemTotal}>
                        <div className={styles.totalPrice}>৳{totalPrice.toFixed(2)}</div>
                        {item.discount > 0 && (
                          <div className={styles.savings}>
                            Saved ৳{totalDiscount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className={styles.orderTotals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className={styles.totalRow}>
                    <span>Discount</span>
                    <span className={styles.discount}>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? "FREE" : `৳${deliveryCharge.toFixed(2)}`}</span>
                </div>
                <div className={styles.grandTotal}>
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Checkout Form Section */}
        <section className={styles.checkoutForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.formInput}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Delivery Method</h2>
              <div className={styles.radioGroup}>
                <label className={`${styles.radioOption} ${formData.deliveryMethod === 'home' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="home"
                    checked={formData.deliveryMethod === 'home'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <div className={styles.radioIcon}>
                      <FaShippingFast />
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.optionTitle}>Home Delivery</span>
                      <span className={styles.optionSubtitle}>৳50 delivery fee</span>
                    </div>
                  </div>
                </label>
                <label className={`${styles.radioOption} ${formData.deliveryMethod === 'pickup' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={formData.deliveryMethod === 'pickup'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <div className={styles.radioIcon}>
                      <FaStoreAlt />
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.optionTitle}>Store Pickup</span>
                      <span className={styles.optionSubtitle}>Free • Mirpur-10, Dhaka</span>
                    </div>
                  </div>
                </label>
              </div>

              {formData.deliveryMethod === 'home' && (
                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.formLabel}>Delivery Address</label>
                  <textarea
                    id="address"
                    name="address"
                    className={styles.formTextarea}
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Payment Method</h2>
              <div className={styles.radioGroup}>
                <label className={`${styles.radioOption} ${formData.paymentMethod === 'COD' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <div className={styles.radioIcon}>
                      <FaMoneyBillWave />
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.optionTitle}>Cash on Delivery</span>
                      <span className={styles.optionSubtitle}>Pay when you receive your order</span>
                    </div>
                  </div>
                </label>
                <label className={`${styles.radioOption} ${formData.paymentMethod === 'Bkash' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bkash"
                    checked={formData.paymentMethod === 'Bkash'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <div className={styles.radioIcon}>
                      <FaMobileAlt />
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.optionTitle}>bKash</span>
                      <span className={styles.optionSubtitle}>Send payment to 015XXXXXXXX</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label htmlFor="note" className={styles.formLabel}>Order Notes (Optional)</label>
                <textarea
                  id="note"
                  name="note"
                  className={styles.formTextarea}
                  value={formData.note}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Special instructions, delivery preferences, etc."
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={cartItems.length === 0}
              >
                Complete Order • ৳{total.toFixed(2)}
              </button>
              <p className={styles.securityNote}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.lockIcon}>
                  <path d="M12 1C8.676 1 6 3.676 6 7v3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4z" fill="currentColor"/>
                </svg>
                Secure checkout. Your information is protected.
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;