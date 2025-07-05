import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductPage.module.css";
import { Link } from "react-router";
import { FaCartArrowDown } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import QASection from "./QASection";
import ReviewSection from "./ReviewSection";
import RelatedProductPage from "./RelatedProductPage";
import Notification from "./Notification";

const ProductPage = () => {
  const location = useLocation();
  const pageRef = useRef();

  // Initialize state for product and id
  const [product, setProduct] = useState(null);
  const [id, setId] = useState(location.state?.id);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null); // State for main image
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };
  console.log(selectedSize);
  console.log(selectedColor);
  // Set selectedColor and selectedSize when product data is loaded
  useEffect(() => {
    if (product) {
      setSelectedColor(Object.keys(product.colors)[0]); // Default to the first color
      setSelectedSize(product.sizes[0]); // Default to the first size
    }
  }, [product]);

  // Update main image whenever selected color changes
  useEffect(() => {
    if (product && selectedColor) {
      setMainImage(product.colors[selectedColor]?.[0]); // Set the first image of the selected color
    }
  }, [product, selectedColor]);

  // Fetch product data when `id` is available
  useEffect(() => {
    const fetchProductData = async () => {
      console.log("fetchProductData is called!");
      if (!id) return;

      const response = await fetch(`http://localhost:8080/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data); // Set product data
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // If product is still loading
  if (!product) {
    return <div>Loading...</div>;
  }

  // Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color); // Update selected color
  };

  // Handle size change
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Increase quantity
  const handleIncrease = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  // Decrease quantity
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Calculating discounted price
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;
  const colorOptions = Object.keys(product.colors);
  const images = product.colors[selectedColor] || [];

  // Handle Add to Cart click
  const handleAddToCart = async () => {
    const cartItem = {
      email: "",
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
    };
    console.log("Inside of add to cart");
    try {
      const response = await fetch("http://localhost:8080/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.text();
        console.log("Product added to cart successfully:", result);
        showNotif(result, "success");
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong");
      }
    } catch (error) {
      showNotif(error.message,"error");
      // setErrorMessage(error.message);
      console.error("Error occurred during add to cart:", error.message);
    }
  };

  return (
    <div ref={pageRef} className={styles.pageWrapper}>
      <div className={styles.productContainer}>
        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationType}
            onClose={() => setShowNotification(false)}
          />
        )}
        <div className={styles.imageGallery}>
          {/* Main image */}
          <img
            src={mainImage}
            alt="Main Product"
            className={styles.mainImage}
          />
          <div className={styles.thumbnailRow}>
            {/* Thumbnail images */}
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setMainImage(img)} // Update main image on thumbnail click
                className={`${styles.thumbnail} ${
                  mainImage === img ? styles.activeThumb : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>

          <div>
            <strong>Type:</strong> {product.type}
          </div>
          <div>
            <strong>Category:</strong> {product.category}
          </div>
          <div>
            <strong>Brand:</strong> {product.brand}
          </div>
          <div>
            <strong>Material:</strong> {product.material}
          </div>

          <div className={styles.priceBox}>
            <span className={styles.discountPrice}>
              ৳{(discountedPrice * quantity).toFixed(2)}
            </span>
            {product.discount !== 0 && (
              <span className={styles.originalPrice}>
                ৳{(product.price * quantity).toFixed(2)}
              </span>
            )}
            {product.discount !== 0 && (
              <span className={styles.discount}>
                Save ৳
                {(
                  product.price * quantity -
                  discountedPrice * quantity
                ).toFixed(2)}{" "}
                ({product.discount}% OFF)
              </span>
            )}
          </div>

          <div className={styles.rating}>
            {Array.from({ length: 5 }).map((_, index) => {
              const fullStars = Math.floor(product.rating);
              const hasHalfStar = product.rating - fullStars >= 0.5;
              if (index < fullStars) return <span key={index}>★</span>;
              if (index === fullStars && hasHalfStar)
                return <span key={index}>⯨</span>;
              return <span key={index}>☆</span>;
            })}
            ({product.rating.toFixed(1)}/5)
          </div>

          <div className={styles.stock}>
            {product.availability ? "✅ In stock" : "❌ Out of stock"}
          </div>

          <div className={styles.variant}>
            <label>Select Color:</label>
            <div className={styles.colorOptions}>
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)} // Set the selected color
                  className={`${styles.colorButton} ${
                    selectedColor === color ? styles.activeColor : ""
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.variant}>
            <label>Select Size:</label>
            <select value={selectedSize} onChange={handleSizeChange}>
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.quantity}>
            <label>Quantity:</label>
            <div className={styles.qtyControl}>
              <button onClick={handleDecrease}>−</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.cartBtn} onClick={handleAddToCart}>
              <FaCartArrowDown className={styles.cartIcon} /> Add to Cart
            </button>
            <Link to="/CheckoutPage">
              <button className={styles.buyBtn}>
                <HiShoppingBag className={styles.cartIcon} /> Buy Now
              </button>
            </Link>
          </div>

          <div className={styles.delivery}>
            🚚 {product.deliveryInfo}
            <br />
            ↩️ {product.returnPolicy}
          </div>

          <div className={styles.trust}>🔒 {product.trustInfo}</div>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h2>Customer Questions & Answers</h2>
        <div className={styles.subReviewSection}>
          <QASection />
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h2>Customer Reviews</h2>
        <div className={styles.subReviewSection}>
          <ReviewSection />
        </div>
      </div>

      <div className={styles.related}>
        <h2>Related Products</h2>
        <div className={styles.relatedGrid}>
          <RelatedProductPage />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
