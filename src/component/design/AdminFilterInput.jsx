import React, { useState, useEffect } from "react";
import { FiPlus, FiSave, FiX, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Fixed import
import styles from "./AdminFilterInput.module.css";
import { useLocation } from "react-router-dom";

const filterFields = [
  { id: "category", label: "Category", placeholder: "e.g. Casual, Winter" },
  { id: "type", label: "Type", placeholder: "e.g. T-Shirt, Pant" },
  { id: "color", label: "Color", placeholder: "e.g. Red, Blue" },
  { id: "size", label: "Size", placeholder: "e.g. S, M, L" },
  { id: "brand", label: "Brand", placeholder: "e.g. Nike, Easy" },
  { id: "material", label: "Material", placeholder: "e.g. Cotton, Leather" },
];

const AdminFilterInput = () => {
  const location = useLocation();
  const gender = location.state?.gender || "Unisex";
  console.log("Current gender:", gender);

  const [filters, setFilters] = useState({
    category: [],
    type: [],
    color: [],
    size: [],
    brand: [],
    material: [],
  });
  const [inputs, setInputs] = useState({
    category: "",
    type: "",
    color: "",
    size: "",
    brand: "",
    material: "",
  });
  const [editState, setEditState] = useState({ field: null, index: null });
  const [tempValue, setTempValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedCards, setExpandedCards] = useState({}); // Fixed typo
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, field: null, value: null });

  const toggleCardExpand = (fieldId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        console.log("Fetching filters for gender:", gender);
        const response = await fetch(
          `http://localhost:8080/api/filters/get-filters?gender=${encodeURIComponent(gender)}`,
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
          throw new Error(error || "Failed to fetch filters");
        }

        const data = await response.json();
        console.log("Fetched filter data:", data);
        setFilters((prev) => ({
          ...prev,
          ...data,
          category: data.category || [],
          type: data.type || [],
          color: data.color || [],
          size: data.size || [],
          brand: data.brand || [],
          material: data.material || [],
        }));
      } catch (error) {
        console.error("Error fetching filters:", error);
        toast.error(`Error fetching filters: ${error.message}`);
        setFilters({
          category: [],
          type: [],
          color: [],
          size: [],
          brand: [],
          material: [],
        });
      }
    };

    fetchFilters();
  }, [gender]);

  useEffect(() => {
    setInputs({
      category: "",
      type: "",
      color: "",
      size: "",
      brand: "",
      material: "",
    });
    setSelectedCategory("");
    setExpandedCards({});
    setEditState({ field: null, index: null });
    setTempValue("");
    setDeleteConfirm({ show: false, field: null, value: null });
  }, [gender]);

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
    setExpandedCards((prev) => ({ ...prev, [field]: true }));
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
    if (!trimmed) {
      toast.warning("Please enter a valid value");
      return;
    }

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
    setDeleteConfirm({ show: true, field, value }); // Fixed typo
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

  const handleSubmit = async () => {
    try {
      // Validate filters state
      
       const filters2= {
          category: Array.isArray(filters.category) ? filters.category : [],
          type: Array.isArray(filters.type) ? filters.type : [],
          color: Array.isArray(filters.color) ? filters.color : [],
          size: Array.isArray(filters.size) ? filters.size : [],
          brand: Array.isArray(filters.brand) ? filters.brand : [],
          material: Array.isArray(filters.material) ? filters.material : [],
          gender: [gender],
        };
      
      console.log("Filters state:", filters2);

      const response = await fetch("http://localhost:8080/api/filters/save-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters2),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to save filters");
      }

      toast.success("Filters saved successfully!");
    } catch (error) {
      console.error("Error saving filters:", error);
      toast.error(`Error saving filters: ${error.message}`);
    }
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

      {deleteConfirm.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete "{deleteConfirm.value}" from {deleteConfirm.field}?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={cancelDelete}>
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Product Filter Management ({gender})</h2>
          <p className={styles.subtitle}>
            Manage filter options for {gender} products
          </p>
        </div>

        <div className={styles.filterGrid}>
          {filterFields.map((field) => (
            <div
              key={field.id}
              className={`${styles.filterCard} ${expandedCards[field.id] ? styles.expanded : ""}`}
            >
              <div className={styles.cardHeader} onClick={() => toggleCardExpand(field.id)}>
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
          <button className={styles.submitButton} onClick={handleSubmit}>
            <FiSave className={styles.saveIcon} />
            Save All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFilterInput;