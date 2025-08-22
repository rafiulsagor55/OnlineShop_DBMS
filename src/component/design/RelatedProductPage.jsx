import React from "react";
import ScrollSection from "./ScrollSection";
import styles from "./MainContent.module.css";
import {useState, useEffect } from "react";

const RelatedProductPage = ({productType,category,productId}) => {
  const [related, setRelated] = useState([]);
   const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/get-all-related-products?type=${encodeURIComponent(productType)}&category=${encodeURIComponent(category)}&id=${encodeURIComponent(productId)}`);
        const data = await response.json();
        setRelated(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    useEffect(
      () => {
        if (productType) {
          fetchRelatedProducts();
        }
      },
      [productType,category,productId]
    );

  return (
    <main className={styles.mainContent}>
      <ScrollSection cards={[...related]} />
    </main>
  );
};

export default RelatedProductPage;
