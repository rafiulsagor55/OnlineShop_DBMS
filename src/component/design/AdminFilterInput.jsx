import React, { useState } from "react";
import { FiPlus, FiSave, FiX, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsCheckLg, BsThreeDotsVertical } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AdminFilterInput.module.css";

const filterFields = [
  { id: "category", label: "Category", placeholder: "e.g. Clothing, Electronics" },
  { id: "type", label: "Type", placeholder: "e.g. T-Shirt, Smartphone" },
  { id: "color", label: "Color", placeholder: "e.g. Red, Blue" },
  { id: "size", label: "Size", placeholder: "e.g. S, M, L" },
  { id: "brand", label: "Brand", placeholder: "e.g. Nike, Apple" },
  { id: "material", label: "Material", placeholder: "e.g. Cotton, Leather" },
];

const AdminFilterInput = () => {
  const [filters, setFilters] = useState({
    category: ["Clothing", "Electronics"],
    type: ["T-Shirt", "Jeans"],
    color: ["Red", "Blue"],
    size: ["S", "M", "L"],
    brand: ["Nike", "Adidas"],
    material: ["Cotton", "Polyester"]
  });

  const [inputs, setInputs] = useState({});
  const [editState, setEditState] = useState({ field: null, index: null });
  const [tempValue, setTempValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, field: null, value: null });

  const toggleCardExpand = (fieldId) => {
    setExpandedCards(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const handleChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = (field) => {
    const value = inputs[field]?.trim();
    if (!value) {
      toast.warning(`Please enter a value for ${field}`);
      return;
    }

    if (filters[field].includes(value)) {
      toast.warning(`"${value}" already exists in ${field}`);
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));

    setInputs((prev) => ({ ...prev, [field]: "" }));
    toast.success(`"${value}" added to ${field}`);
  };

  const startEdit = (field, index, currentValue) => {
    setEditState({ field, index });
    setTempValue(currentValue);
  };

  const cancelEdit = () => {
    setEditState({ field: null, index: null });
    setTempValue("");
  };

  const saveEdit = () => {
    const { field, index } = editState;
    const trimmed = tempValue.trim();
    if (!trimmed) return;
    
    if (filters[field].includes(trimmed)) {
      toast.warning(`"${trimmed}" already exists in ${field}`);
      return;
    }

    setFilters((prev) => {
      const updated = [...prev[field]];
      updated[index] = trimmed;
      return { ...prev, [field]: updated };
    });

    cancelEdit();
    toast.success(`"${trimmed}" updated successfully`);
  };

  const showDeleteConfirm = (field, value) => {
    setDeleteConfirm({ show: true, field, value });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, field: null, value: null });
  };

  const confirmDelete = () => {
    const { field, value } = deleteConfirm;
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
    toast.info(`"${value}" removed from ${field}`);
    cancelDelete();
  };

  const handleSubmit = () => {
    toast.success("Filters would be saved to backend here!");
    console.log("Filters to be saved:", filters);
  };

  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") {
      handleAdd(field);
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{deleteConfirm.value}" from {deleteConfirm.field}?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancel}
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className={styles.modalConfirm}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Product Filter Management</h2>
          <p className={styles.subtitle}>
            Manage filter options (Demo - No backend connected)
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.categorySelector}>
            <label className={styles.selectorLabel}>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              {filters.category?.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.filterGrid}>
          {filterFields.map((field) => (
            <div key={field.id} className={`${styles.filterCard} ${expandedCards[field.id] ? styles.expanded : ''}`}>
              <div 
                className={styles.cardHeader} 
                onClick={() => toggleCardExpand(field.id)}
              >
                <div className={styles.cardTitleWrapper}>
                  <h3 className={styles.cardTitle}>{field.label}</h3>
                  <span className={styles.itemCount}>
                    {filters[field.id]?.length || 0} items
                  </span>
                </div>
                <button className={styles.expandButton}>
                  {expandedCards[field.id] ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {expandedCards[field.id] && (
                <>
                  {filters[field.id]?.length > 0 ? (
                    <div className={styles.itemList}>
                      {filters[field.id].map((item, index) => {
                        const isEditing =
                          editState.field === field.id && editState.index === index;

                        return (
                          <div key={index} className={styles.itemRow}>
                            <div className={styles.itemContent}>
                              {isEditing ? (
                                <input
                                  className={styles.editInput}
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                                  autoFocus
                                />
                              ) : (
                                <span className={styles.itemLabel}>{item}</span>
                              )}
                            </div>

                            <div className={styles.itemActions}>
                              {isEditing ? (
                                <>
                                  <button
                                    className={`${styles.actionButton} ${styles.saveButton}`}
                                    onClick={saveEdit}
                                    title="Save"
                                  >
                                    <BsCheckLg />
                                  </button>
                                  <button
                                    className={`${styles.actionButton} ${styles.cancelButton}`}
                                    onClick={cancelEdit}
                                    title="Cancel"
                                  >
                                    <FiX />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => startEdit(field.id, index, item)}
                                    title="Edit"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => showDeleteConfirm(field.id, item)}
                                    title="Delete"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      No {field.label.toLowerCase()} options added yet
                    </div>
                  )}

                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, field.id)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => handleAdd(field.id)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            <FiSave className={styles.saveIcon} />
            Save All Filters (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFilterInput;