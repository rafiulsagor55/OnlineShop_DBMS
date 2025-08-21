import React, { useState, useRef, useEffect } from "react";
import styles from "./EditProductPage.module.css";
import { FaShoppingBag } from "react-icons/fa";
import { RiShoppingBag3Fill } from "react-icons/ri";
import {
  FiUpload,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiSave,
  FiEdit,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Modal from "./Modal";
import Notification from "./Notification";
import { useParams } from "react-router-dom";


const predefinedOptions = {
  gender: ["Male", "Female", "Kids", "Unisex", "Others"],
  category: ["Casual", "Formal", "Party", "Traditional", "Others"],
  type: ["Shirt", "T-Shirt", "Jeans", "Panjabi", "Others"],
  brand: ["Aarong", "Cats Eye", "Yellow", "Dorjibari", "Others"],
  material: ["Cotton", "Denim", "Silk", "Polyester", "Others"],
};

const colorSuggestions = [
  "White",
  "Black",
  "Gray",
  "Blue",
  "Red",
  "Yellow",
  "Green",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Maroon",
  "Olive",
  "Navy",
];

const standardSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
];

const EditProductPage = () => {
  const param = useParams();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    type: "",
    brand: "",
    material: "",
    category: "",
    availability: "In Stock",
    price: "",
    discount: "",
    rating: "",
    sizes: [],
    sizeDetails: "",
    colors: {},
    deliveryInfo: "",
    returnPolicy: "",
    trustInfo: "",
    gender:"",
  });

  const [showCustomInput, setShowCustomInput] = useState({
    category: false,
    type: false,
    brand: false,
    material: false,
  });

  const [newColor, setNewColor] = useState("");
  // const [colorImages, setColorImages] = useState({});
  const [previews, setPreviews] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [customSize, setCustomSize] = useState("");
  const [showCustomSizeInput, setShowCustomSizeInput] = useState(false);
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");

  const showNotif = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  useEffect(() => {
    const fetchProductData = async () => {      
      const id = param.id;
      console.log("fetchProductData is called!"+ id);
      if (!id) return;

      const response = await fetch(`http://localhost:8080/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data); 
      }
    };
    fetchProductData();

    // Set previews for existing color images
    const initialPreviews = {};
    Object.keys(formData.colors).forEach((color) => {
      initialPreviews[color] = formData.colors[color];
    });
    setPreviews(initialPreviews);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (isNaN(formData.price)) newErrors.price = "Price must be a number";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (Object.keys(formData.colors).length === 0)
      newErrors.colors = "At least one color is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (
      (name === "price" || name === "discount" || name === "rating") &&
      value < 0
    )
      return;
    if (name === "discount" && value > 100) return;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeSelection = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleAddCustomSize = () => {
    if (
      customSize.trim() &&
      !formData.sizes.includes(customSize.toUpperCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, customSize.toUpperCase()],
      }));
      setCustomSize("");
      setShowCustomSizeInput(false);
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleDropdownChange = (e, field) => {
    const value = e.target.value;

    if (value === "Others") {
      // Others সিলেক্ট করলে কাস্টম ইনপুট দেখান
      setShowCustomInput((prev) => ({ ...prev, [field]: true }));
      // ফিল্ডের ভ্যালু খালি করুন
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else {
      // অন্য কিছু সিলেক্ট করলে কাস্টম ইনপুট লুকান
      setShowCustomInput((prev) => ({ ...prev, [field]: false }));
      // ফিল্ডের ভ্যালু সেট করুন
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // কাস্টম ইনপুট হ্যান্ডলার
  const handleCustomInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file upload (convert to base64)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64
      reader.onload = () => resolve(reader.result); // Resolve with base64 string
      reader.onerror = (error) => reject(error); // Reject if error occurs
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!newColor || files.length === 0) return;

    for (let file of files) {
 
      if(!file.type.match('image.*')){
        setErrorMessage("Please select image.")
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must be less than 2MB");
        return;   
      }

      // 2. Create Object URL for dimension check
      const objectURL = URL.createObjectURL(file);
      const img = new Image();

      img.onload = async () => {
        // Always revoke the object URL after image is loaded
        URL.revokeObjectURL(objectURL); // ✅ Memory cleanup

        const { width, height } = img;

        // 3. Check for 1:1 aspect ratio (with tolerance)
        if (Math.abs(width - height) > 5) {
          setErrorMessage("Image must have a 1:1 aspect ratio");
          return;
        }

        try {
          // 4. Convert to base64
          const base64String = await convertToBase64(file);

          // 5. Store the base64 image in state
          setPreviews((prev) => ({
            ...prev,
            [newColor]: [...(prev[newColor] || []), base64String],
          }));
        } catch (error) {
          setErrorMessage("Error uploading image: " + error.message);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectURL); // Even on error, clean up
        setErrorMessage("Error loading image");
      };

      img.src = objectURL; // 6. Start loading the image
    }
  };

  const handleAddColor = () => {
    if (!newColor) {
      setErrors((prev) => ({ ...prev, colors: "Please select a color" }));
      return;
    }

    if (!previews[newColor] || previews[newColor].length === 0) {
      setErrors((prev) => ({
        ...prev,
        colors: "Please upload at least one image for this color",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: { ...prev.colors, [newColor]: previews[newColor] },
    }));
    setNewColor("");
    setErrors((prev) => ({ ...prev, colors: "" }));
  };

  const handleRemoveColor = (color) => {
    const newColors = { ...formData.colors };
    delete newColors[color];
    setFormData((prev) => ({ ...prev, colors: newColors }));

    const newPreviews = { ...previews };
    delete newPreviews[color];
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (color, index) => {
    const newPreviews = { ...previews };
    newPreviews[color] = newPreviews[color].filter((_, i) => i !== index);
    setPreviews(newPreviews);

    if (formData.colors[color]) {
      const newColors = { ...formData.colors };
      newColors[color] = newPreviews[color];
      setFormData((prev) => ({ ...prev, colors: newColors }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setShowOverview(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const SaveEditedProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/products/save-edited-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(formData), 
          credentials: "include", // Include credentials for session management
        }
      );

      if (response.ok) {
        const result = await response.text(); // Assuming the backend returns JSON response
        console.log("Product saved successfully:", result);
        showNotif(result, "success");
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong");
      }
    } catch (error) {
      // showNotif(error.message,"error");
      setErrorMessage(error.message);
      console.error("Error occurred during form submission:", error.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationType}
            onClose={() => setShowNotification(false)}
          />
        )}

        {errorMessage && (
          <Modal
            message={errorMessage}
            onClose={() => {
              setErrorMessage("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            key={errorMessage}
          />
        )}


        <div className={styles.header}>
          <h1 className={styles.heading}>
            <FiEdit className={styles.editIcon} /> Edit Product
          </h1>
          <div className={styles.productId}>
            <RiShoppingBag3Fill /> Product ID: {formData.id}
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "basic" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "details" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "media" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {activeTab === "basic" && (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Basic Information</h3>
                <div className={styles.grid2}>
                  <div className={styles.row}>
                    <label>
                      Product Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Cotton T-Shirt"
                      className={errors.name ? styles.errorInput : ""}
                    />
                    {errors.name && (
                      <span className={styles.error}>{errors.name}</span>
                    )}
                  </div>

                  <div className={styles.row}>
                    <label>
                      Price (৳) <span className={styles.required}>*</span>
                    </label>
                    <input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      type="number"
                      placeholder="e.g. 599"
                      className={errors.price ? styles.errorInput : ""}
                    />
                    {errors.price && (
                      <span className={styles.error}>{errors.price}</span>
                    )}
                  </div>

                  <div className={styles.row}>
                    <label>Discount (%)</label>
                    <input
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      type="number"
                      placeholder="e.g. 10"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className={styles.row}>
                    <label>Rating</label>
                    <input
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="e.g. 4.5"
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Product description..."
                    rows="4"
                  />
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Classification</h3>
                <div className={styles.grid2}>
                  {["gender","category", "type", "brand", "material"].map((field) => (
                    <div className={styles.row} key={field}>
                      <label>
                        {field[0].toUpperCase() + field.slice(1)}
                        {["gender","type", "brand"].includes(field) && (
                          <span className={styles.required}>*</span>
                        )}
                      </label>
                      <select
                        value={formData[field]}
                        onChange={(e) => handleDropdownChange(e, field)}
                        className={errors[field] ? styles.errorInput : ""}
                      >
                        <option value="">-- Select --</option>
                        {predefinedOptions[field].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {/* কাস্টম ইনপুট শুধুমাত্র Others সিলেক্ট করলে দেখাবে */}
                      {showCustomInput[field] && (
                        <input
                          type="text"
                          placeholder={`Enter custom ${field}`}
                          value={formData[field]}
                          onChange={(e) => handleCustomInputChange(e, field)}
                          className={styles.customInput}
                        />
                      )}
                      {errors[field] && (
                        <span className={styles.error}>{errors[field]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "details" && (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Inventory</h3>
                <div className={styles.grid2}>
                  <div className={styles.row}>
                    <label>Availability</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Pre-order">Pre-order</option>
                      <option value="Backorder">Backorder</option>
                    </select>
                  </div>
                </div>

                <div className={styles.row}>
                  <label>Sizes</label>
                  <div className={styles.sizeOptions}>
                    {standardSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`${styles.sizeBtn} ${
                          formData.sizes.includes(size)
                            ? styles.selectedSize
                            : ""
                        }`}
                        onClick={() => handleSizeSelection(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {!showCustomSizeInput ? (
                    <button
                      type="button"
                      className={styles.addCustomSizeBtn}
                      onClick={() => setShowCustomSizeInput(true)}
                    >
                      <FiPlus /> Add Custom Size
                    </button>
                  ) : (
                    <div className={styles.customSizeInputGroup}>
                      <input
                        type="text"
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        placeholder="Enter custom size (e.g., 28, 32)"
                        className={styles.customSizeInput}
                      />
                      <button
                        type="button"
                        className={styles.addSizeBtn}
                        onClick={handleAddCustomSize}
                        disabled={!customSize.trim()}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className={styles.cancelSizeBtn}
                        onClick={() => {
                          setShowCustomSizeInput(false);
                          setCustomSize("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {formData.sizes.length > 0 && (
                    <div className={styles.selectedSizesContainer}>
                      <label>Selected Sizes:</label>
                      <div className={styles.selectedSizes}>
                        {formData.sizes.map((size) => (
                          <span key={size} className={styles.sizeTag}>
                            {size}
                            <button
                              type="button"
                              className={styles.removeSizeBtn}
                              onClick={() => handleRemoveSize(size)}
                            >
                              <MdDelete />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.row}>
                  <label>Size Details</label>
                  <textarea
                    name="sizeDetails"
                    value={formData.sizeDetails}
                    onChange={handleChange}
                    placeholder="e.g. Size chart or specific measurements"
                    rows="4"
                  />
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Policies</h3>
                <div className={styles.row}>
                  <label>Delivery Information</label>
                  <input
                    name="deliveryInfo"
                    value={formData.deliveryInfo}
                    onChange={handleChange}
                    placeholder="e.g. Free delivery for orders over ৳1000"
                  />
                </div>

                <div className={styles.row}>
                  <label>Return Policy</label>
                  <input
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleChange}
                    placeholder="e.g. 7 days return policy"
                  />
                </div>

                <div className={styles.row}>
                  <label>Trust Information</label>
                  <input
                    name="trustInfo"
                    value={formData.trustInfo}
                    onChange={handleChange}
                    placeholder="e.g. 100% authentic products"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "media" && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Colors & Images <span className={styles.required}>*</span>
              </h3>
              {errors.colors && (
                <span className={styles.error}>{errors.colors}</span>
              )}

              <div className={styles.colorSelection}>
                <div className={styles.row}>
                  <label>Add New Color</label>
                  <input
                    list="colorOptions"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g. Navy Blue"
                  />
                  <datalist id="colorOptions">
                    {colorSuggestions.map((color) => (
                      <option key={color} value={color} />
                    ))}
                  </datalist>
                </div>

                <div className={styles.row}>
                  <label>Upload Images</label>
                  <div className={styles.uploadContainer}>
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={triggerFileInput}
                    >
                      <FiUpload className={styles.uploadIcon} />
                      Choose Files
                    </button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className={styles.hiddenFileInput}
                    />
                    <span className={styles.uploadHint}>
                      Max 5 images per color (JPEG, PNG)
                    </span>
                  </div>
                </div>
              </div>

              {newColor && previews[newColor] && (
                <div className={styles.colorPreview}>
                  <h4>Preview: {newColor}</h4>
                  <div className={styles.previewRow}>
                    {previews[newColor]?.map((src, i) => (
                      <div key={i} className={styles.imagePreviewContainer}>
                        <img
                          src={src}
                          alt={`preview-${newColor}-${i}`}
                          className={styles.thumbnail}
                        />
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => handleRemoveImage(newColor, i)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.addColorBtn}
                    onClick={handleAddColor}
                    disabled={!newColor || !previews[newColor]}
                  >
                    Add Color With Image
                  </button>
                </div>
              )}

              <div className={styles.addedColors}>
                <h4>Current Colors & Images</h4>
                {Object.entries(formData.colors).map(([color, imgs]) => (
                  <div key={color} className={styles.addedColorGroup}>
                    <div className={styles.addedColorHeader}>
                      <div
                        className={styles.colorTag}
                        style={{ backgroundColor: "white", color: "black" }}
                      >
                        {color}
                      </div>
                      <button
                        type="button"
                        className={styles.removeColorBtn}
                        onClick={() => handleRemoveColor(color)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div className={styles.previewRow}>
                      {imgs.map((src, i) => (
                        <div key={i} className={styles.imagePreviewContainer}>
                          <img
                            src={src}
                            alt={`${color}-${i}`}
                            className={styles.thumbnail}
                          />
                          <button
                            type="button"
                            className={styles.removeImageBtn}
                            onClick={() => handleRemoveImage(color, i)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            {activeTab !== "basic" && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() =>
                  setActiveTab(activeTab === "details" ? "basic" : "details")
                }
              >
                Back
              </button>
            )}

            {activeTab !== "media" ? (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() =>
                  setActiveTab(activeTab === "basic" ? "details" : "media")
                }
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                <FiSave className={styles.submitIcon} />
                Show Edited Product Overview
              </button>
            )}
          </div>
        </form>
        {showOverview && (
          <div className={styles.overview}>
            <div className={styles.overviewHeader}>
              <h2>🧾 Product Overview</h2>
              <button
                className={styles.editBtn}
                onClick={() => {
                  setShowOverview(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Remove
              </button>
            </div>

            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h3>Edited Product Overview</h3>
            </div>

            <div className={styles.grid}>
              <div className={styles.overviewSection}>
                <h4>Basic Information</h4>
                <div className={styles.overviewRow}>
                  <strong>ID:</strong> {formData.id}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Name:</strong> {formData.name}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Description:</strong> {formData.description}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Price:</strong> {formatPrice(formData.price)}
                </div>
                {formData.discount && (
                  <div className={styles.overviewRow}>
                    <strong>Discount:</strong> {formData.discount}% (Final
                    price:{" "}
                    {formatPrice(
                      formData.price * (1 - formData.discount / 100)
                    )}
                    )
                  </div>
                )}
              </div>

              <div className={styles.overviewSection}>
                <h4>Classification</h4>
                <div className={styles.overviewRow}>
                  <strong>Gender:</strong> {formData.gender}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Category:</strong> {formData.category}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Type:</strong> {formData.type}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Brand:</strong> {formData.brand}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Material:</strong> {formData.material}
                </div>
              </div>

              <div className={styles.overviewSection}>
                <h4>Inventory</h4>
                <div className={styles.overviewRow}>
                  <strong>Availability:</strong> {formData.availability}
                </div>
                {formData.sizes.length > 0 && (
                  <div className={styles.overviewRow}>
                    <strong>Sizes:</strong>
                    <div className={styles.overviewSizes}>
                      {formData.sizes.map((size) => (
                        <span key={size} className={styles.overviewSizeTag}>
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.overviewRow}>
                  <strong>Size Details:</strong> {formData.sizeDetails || "Not specified"}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Rating:</strong>{" "}
                  {formData.rating ? `${formData.rating}★` : "Not rated"}
                </div>
              </div>

              <div className={styles.overviewSection}>
                <h4>Policies</h4>
                <div className={styles.overviewRow}>
                  <strong>Delivery Info:</strong>{" "}
                  {formData.deliveryInfo || "Not specified"}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Return Policy:</strong>{" "}
                  {formData.returnPolicy || "Not specified"}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Trust Info:</strong>{" "}
                  {formData.trustInfo || "Not specified"}
                </div>
              </div>
            </div>

            <div className={styles.colorImageBlock}>
              <h3>Colors & Images</h3>
              {Object.entries(formData.colors).map(([color, imgs]) => (
                <div key={color} className={styles.colorGroup}>
                  <div
                    className={styles.colorTag}
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    {color}
                  </div>
                  <div className={styles.previewRow}>
                    {imgs.map((src, i) => (
                      <img
                        src={src}
                        key={i}
                        alt={`${color}-${i}`}
                        className={styles.thumbnail}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.overviewActions}>
              <button className={styles.publishBtn} onClick={SaveEditedProduct}>
                Save Edited Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductPage;
