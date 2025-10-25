import React from "react";
import styles from "./ConfirmModal.module.css";
import { RxCross1 } from "react-icons/rx";

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button
            className={styles.modalCloseButton}
            onClick={onCancel}
            title="Close"
          >
            <RxCross1 />
          </button>
        </div>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button
            className={styles.modalCancelButton}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={styles.modalConfirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;