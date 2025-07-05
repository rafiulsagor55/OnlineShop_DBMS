import React, { useState, useRef } from "react";
import styles from "./ProductInputPage.module.css";
import { FiUpload, FiPlus, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Modal from "./Modal.jsx";

const predefinedOptions = {
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

const ProductInputPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    type: "",
    brand: "",
    material: "",
    category: "",
    customFields: {},
    availability: "In Stock",
    price: "",
    discount: "",
    rating: "",
    sizes: [],
    colors: {},
    deliveryInfo: "",
    returnPolicy: "",
    trustInfo: "",
  });

  const [newColor, setNewColor] = useState("");
  const [previews, setPreviews] = useState({});
  const [showOverview, setShowOverview] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [customSize, setCustomSize] = useState("");
  const [showCustomSizeInput, setShowCustomSizeInput] = useState(false);
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate the form data before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!formData.id) newErrors.id = "Product ID is required";
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

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (
      (name === "price" || name === "discount" || name === "rating") &&
      value < 0
    ) {
      return;
    }
    if (name === "discount" && value > 100) {
      return;
    }
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle selection of size options
  const handleSizeSelection = (size) => {
    setFormData((prev) => {
      if (prev.sizes.includes(size)) {
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s !== size),
        };
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, size],
        };
      }
    });
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleCustomFieldChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      customFields: { ...prev.customFields, [field]: value },
    }));
  };

  const handleDropdownChange = (e, field) => {
    const value = e.target.value;
    if (value === "Others") {
      setFormData((prev) => ({
        ...prev,
        [field]: "",
        customFields: { ...prev.customFields, [field]: "" },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        customFields: { ...prev.customFields, [field]: undefined },
      }));
    }
  };

  // Handle adding custom size
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

  // Handle file upload (using FormData)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!newColor || files.length === 0) return;

    const newPreviews = {};
    newPreviews[newColor] = files.map((file) => URL.createObjectURL(file)); // Create Object URL for preview

    setPreviews((prev) => ({
      ...prev,
      [newColor]: newPreviews[newColor],
    }));
  };

  // Add color with images to the form data
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

  // Remove a color
  const handleRemoveColor = (color) => {
    const newColors = { ...formData.colors };
    delete newColors[color];
    setFormData((prev) => ({ ...prev, colors: newColors }));

    const newPreviews = { ...previews };
    delete newPreviews[color];
    setPreviews(newPreviews);
  };

  // Remove an image from the previews
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

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    
    setShowOverview(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Format price in BDT currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {errorMessage && (
          <Modal
            message={errorMessage}
            onClose={() => {
              setErrorMessage(""); // Clear the error when modal closes
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input
              }
            }}
            key={errorMessage} // Force re-render with new error
          />
        )}
        <h1 className={styles.heading}>🛍️ Add New Product</h1>
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
          {errors.general && (
            <div className={styles.errorBanner}>
              <FiX className={styles.errorIcon} />
              {errors.general}
            </div>
          )}

          {activeTab === "basic" && (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Basic Information</h3>
                <div className={styles.grid2}>
                  <div className={styles.row}>
                    <label>
                      Product ID <span className={styles.required}>*</span>
                    </label>
                    <input
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="e.g. PROD-001"
                      className={errors.id ? styles.errorInput : ""}
                    />
                    {errors.id && (
                      <span className={styles.error}>{errors.id}</span>
                    )}
                  </div>

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
                  {["category", "type", "brand", "material"].map((field) => (
                    <div className={styles.row} key={field}>
                      <label>
                        {field[0].toUpperCase() + field.slice(1)}
                        {["type", "brand"].includes(field) && (
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
                      {errors[field] && (
                        <span className={styles.error}>{errors[field]}</span>
                      )}
                      {formData.customFields[field] !== undefined && (
                        <input
                          type="text"
                          placeholder={`Custom ${field}`}
                          value={formData.customFields[field]}
                          onChange={(e) => handleCustomFieldChange(e, field)}
                          className={styles.customInput}
                        />
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
                      className={styles.availability}
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
                  <label>Select Color</label>
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

              {Object.entries(previews).length > 0 &&
                !Object.keys(formData.colors).includes(newColor) && (
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

              {Object.keys(formData.colors).length > 0 && (
                <div className={styles.addedColors}>
                  <h4>Added Colors with images</h4>
                  {Object.entries(formData.colors).map(([color, imgs]) => (
                    <div key={color} className={styles.addedColorGroup}>
                      <div className={styles.addedColorHeader}>
                        <div
                          className={styles.colorTag}
                          style={{ backgroundColor: "green" }}
                        >
                          {color}
                        </div>
                        <button
                          type="button"
                          className={styles.removeColorBtn}
                          onClick={() => handleRemoveColor(color)}
                        >
                          <FiTrash2 style={{ fontSize: "30px" }} />
                        </button>
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
              )}
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
              <button type="submit" className={styles.submitBtn}>
                <FiCheck className={styles.submitIcon} />
                Show Overview
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
              <h3>Product Overview</h3>
              <p>Your product is now ready to be published.</p>
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
                  <strong>Category:</strong>{" "}
                  {formData.customFields.category || formData.category}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Type:</strong>{" "}
                  {formData.customFields.type || formData.type}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Brand:</strong>{" "}
                  {formData.customFields.brand || formData.brand}
                </div>
                <div className={styles.overviewRow}>
                  <strong>Material:</strong>{" "}
                  {formData.customFields.material || formData.material}
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
              <button className={styles.publishBtn}>Publish Product</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInputPage;
