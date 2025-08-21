import React, { useRef, useEffect } from "react";
import styles from "./ScrollSection.module.css";
import sagorImage from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (12).png";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
// import sagorImage1 from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/sagor1.jpg";
const ScrollSection = ({ title, cards }) => {
  const rowRef = useRef(null);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  const updateArrows = () => {
    const row = rowRef.current;
    if (row) {
      if (leftArrowRef.current)
        leftArrowRef.current.style.display =
          row.scrollLeft > 0 ? "block" : "none";
      if (rightArrowRef.current)
        rightArrowRef.current.style.display =
          row.scrollLeft + row.clientWidth < row.scrollWidth ? "block" : "none";
    }
  };

  useEffect(() => {
    updateArrows();
    const row = rowRef.current;
    row.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    // ✅ Resize observer - detect layout changes
    const resizeObserver = new ResizeObserver(() => {
      updateArrows();
    });
    resizeObserver.observe(row);
    return () => {
      row.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.scrollContainer}>
        <button
          className={`${styles.scrollArrow} ${styles.scrollLeft}`}
          onClick={() =>
            rowRef.current.scrollBy({ left: -500, behavior: "smooth" })
          }
          ref={leftArrowRef}
        >
          ←
        </button>
        <div className={styles.cardRow} ref={rowRef}>
          {cards.map((card, idx) => (
            <Link
              to={`/product/${card.id}`}
              state={{id: `${card.id}`}}
              className={styles.cardLink}
            >
              <div className={styles.customCard} key={idx}>
                <div className={styles.cardImageContainer}>
                  <img src={sagorImage} alt="Card Image" />
                  <div className={styles.cardRating}>★ 4.5</div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle} title={card.name}>{card.name}</h3>
                  <snap className={styles.cardtype}>
                    <snap>Type: {card.type}</snap>
                    <snap>Brand: {card.brand}</snap>
                  </snap>
                  <div className={styles.cardPriceRow}>
                    <div>
                      <span className={styles.cardPrice}>
                        ৳{(card.price * (1 - card.discount / 100)).toFixed(0)}
                      </span>
                      {card.discount > 0 && (
                        <span className={styles.cardOriginalPrice}>
                          ৳{card.price}
                        </span>
                      )}
                    </div>
                    {card.discount > 0 && (
                      <span className={styles.cardDiscount}>
                       Save ৳{card.price-((card.price * (1 - card.discount / 100)).toFixed(0))} ({card.discount}% OFF)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button
          className={`${styles.scrollArrow} ${styles.scrollRight}`}
          onClick={() =>
            rowRef.current.scrollBy({ left: 500, behavior: "smooth" })
          }
          ref={rightArrowRef}
        >
          →
        </button>
      </div>
    </section>
  );
};

export default ScrollSection;
