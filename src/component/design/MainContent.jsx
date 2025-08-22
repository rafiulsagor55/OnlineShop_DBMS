import React from "react";
import ScrollSection from "./ScrollSection";
import styles from "./MainContent.module.css";
import {useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  const [men, setMen] = useState([]);
  const [women, setWomen] = useState([]);
  const [kid, setKid] = useState([]);
  const [unisex, setUnisex] = useState([]);
  const [top, setTop] = useState([]);
  

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
  const location1 = location.pathname=== "/";

  return (
    <>
    <Outlet/>
    {
      location1 && (
        <main className={styles.mainContent}>
      {
        top.length > 0 && (
          <ScrollSection title="Top Rated Products" cards={[...top]} />
        )
      }
      {
        men.length > 0 && (
          <ScrollSection title="Popular Men's Wear" cards={[...men]} />
        )
      }
      
      {
        women.length > 0 && (
          <ScrollSection title="Popular Women's Wear" cards={[...women]} />
        )
      }
      {
        kid.length > 0 && (
          <ScrollSection title="Popular Kids' Wear" cards={[...kid]} />
        )
      }

      {
        unisex.length > 0 && (
          <ScrollSection title="Popular Unisex Wear" cards={[...unisex]} />
        )
      }
      
    </main>
      )
    } 
    </>
  );
};

export default MainContent;
