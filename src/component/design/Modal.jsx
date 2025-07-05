import React, { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ message, onClose, triggerId }) => {
  const modalRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [internalMessage, setInternalMessage] = useState(message);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Reset internal state when message or triggerId changes
  useEffect(() => {
    setInternalMessage(message);
  }, [message, triggerId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMounted && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isMounted, internalMessage]);

  const handleClose = () => {
    setInternalMessage(null); // Clear internal state
    onClose(); // Call parent handler
  };

  if (!internalMessage) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div 
        className={styles.modal} 
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        key={triggerId} // Force re-render when triggerId changes
      >
        <div className={styles.modalDecorTop}></div>
        
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            <svg className={styles.notificationIcon} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          
          <p className={styles.message}>{internalMessage}</p>
          
          <button 
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <span>Close</span>
            <svg className={styles.closeIcon} viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.modalDecorBottom}></div>
      </div>
    </div>
  );
};

export default Modal;