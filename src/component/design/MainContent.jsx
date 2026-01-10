import React, { useState, useEffect, useContext } from "react";
import ScrollSection from "./ScrollSection";
import styles from "./MainContent.module.css";
import { Outlet } from "react-router-dom";
import { UserContext } from "../UserContext";

const MainContent = () => {
  const [men, setMen] = useState([]);
  const [women, setWomen] = useState([]);
  const [kid, setKid] = useState([]);
  const [unisex, setUnisex] = useState([]);
  const [top, setTop] = useState([]);
  const { searchItem } = useContext(UserContext); // Get searchItem from context
  
  // Fetch product data for different categories
  const fetchProductsMen = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/get-all-mens-products-limit");
      const data = await response.json();
      setMen(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductsWomen = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/get-all-womens-products-limit");
      const data = await response.json();
      setWomen(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductsKids = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/get-all-kids-products-limit");
      const data = await response.json();
      setKid(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductsUnisex = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/get-all-unisex-products-limit");
      const data = await response.json();
      setUnisex(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductsTop = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/get-all-products");
      const data = await response.json();
      setTop(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductsMen();
    fetchProductsWomen();
    fetchProductsKids();
    fetchProductsUnisex();
    fetchProductsTop();
  }, []);

  // Function to filter products based on searchItem
  const filterProductsBySearch = (products, searchItem) => {
    if (!searchItem) return products;
    const lowercasedSearchItem = searchItem.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercasedSearchItem) ||
      product.type.toLowerCase().includes(lowercasedSearchItem) ||
      product.brand.toLowerCase().includes(lowercasedSearchItem)
    );
  };

  const location1 = location.pathname === "/";

  // Filtered products
  const filteredMen = filterProductsBySearch(men, searchItem);
  const filteredWomen = filterProductsBySearch(women, searchItem);
  const filteredKid = filterProductsBySearch(kid, searchItem);
  const filteredUnisex = filterProductsBySearch(unisex, searchItem);
  const filteredTop = filterProductsBySearch(top, searchItem);

  return (
    <>
      <Outlet />
      {
        location1 && (
          <main className={styles.mainContent}>
            {
              filteredTop.length > 0 && (
                <ScrollSection title="Top Rated Products" cards={filteredTop} />
              )
            }
            {
              filteredMen.length > 0 && (
                <ScrollSection title="Popular Men's Wear" cards={filteredMen} />
              )
            }
            {
              filteredWomen.length > 0 && (
                <ScrollSection title="Popular Women's Wear" cards={filteredWomen} />
              )
            }
            {
              filteredKid.length > 0 && (
                <ScrollSection title="Popular Kids' Wear" cards={filteredKid} />
              )
            }
            {
              filteredUnisex.length > 0 && (
                <ScrollSection title="Popular Unisex Wear" cards={filteredUnisex} />
              )
            }
          </main>
        )
      }
    </>
  );
};

export default MainContent;
