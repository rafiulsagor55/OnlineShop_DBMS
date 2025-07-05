// TypeBasedItem.jsx
import React, { useMemo, useState } from "react";
import styles from "./TypeBasedItem.module.css";
import sagorImage from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (5).png";
import { Link } from "react-router-dom";

const filterOptions = {
  gender: [
    "All", "Boys", "Girls", "Unisex"
  ],
  category: [
    "All", 
    "Summer", "Winter", "Sports", "Newborn","Festival", "Others"
  ],
  type: [
    "All", "T-Shirt", "Shirt", "Jeans", "Pants", 
    "Shorts", "Jacket",
    "Sweater", "Hoodie", "Panjabi", "Pyjama", "Others"
  ],
  color: [
    "All", "Red", "Blue", "Pink", "Yellow", 
    "Green", "Purple", "Black", "White", "Gray",
    "Orange", "Brown", "Multicolor", "Others"
  ],
  size: [
    "All", 
    // Baby sizes
    "Newborn", "0-3M", "3-6M", "6-12M",
    // Toddler sizes
    "12-18M", "18-24M", "2T", "3T", "4T",
    // Kids sizes
    "5", "6", "7", "8", "10", "12", "14",
    // Youth sizes
    "XS", "S", "M", "L", "Others"
  ],
  brand: [
    "All", "Mini Club", "Gap Kids", "H&M Kids", "Zara Kids",
    "Carter's", "OshKosh", "Next", "Pantaloons Kids", "Others"
  ],
  material: [
    "All", "Cotton", "Denim", "Polyester", "Fleece",
    "Wool", "Organic Cotton", "Linen", "Blended", "Others"
  ],
  price: [
    "All", "Under 300", "300 - 599", "600 - 999", 
    "1000 - 1499", "1500 - 1999", "2000+"
  ],
  rating: ["All", "5★", "4★ & above", "3★ & above", "2★ & above", "1★ & above"],
  availability: ["All", "In Stock", "Out of Stock", "Coming Soon"],
  discount: [
    "All", "10% or more", "20% or more", 
    "30% or more", "50% or more", "70% or more"
  ],
};

const sortOptions = [
  "Best Selling", "Customer Rating", "Newest First",
  "Discount: High to Low", "Price: Low to High", "Price: High to Low",
];
// const filterOptions =filterOptions1
//------------------------------
// Data
//------------------------------
const rawCards = [
  // Newborn Items
  { id: "1", name: "Organic Cotton Bodysuit", rating: 4.8, type: "T-Shirt", color: "Blue", size: "0-3M", brand: "Carter's", price: 350, discount: 10, material: "Organic Cotton", availability: "In Stock", category: "Newborn", gender: "Unisex" },
  { id: "2", name: "Soft Fleece Romper", rating: 4.5, type: "Pyjama", color: "Pink", size: "3-6M", brand: "H&M Kids", price: 450, discount: 15, material: "Fleece", availability: "In Stock", category: "Newborn", gender: "Girls" },

  // Summer Wear
  { id: "3", name: "Color Block T-Shirt", rating: 4.3, type: "T-Shirt", color: "Multicolor", size: "5", brand: "Gap Kids", price: 400, discount: 20, material: "Cotton", availability: "In Stock", category: "Summer", gender: "Boys" },
  { id: "4", name: "Striped Cotton Shorts", rating: 4.2, type: "Shorts", color: "Blue", size: "6", brand: "Zara Kids", price: 500, discount: 10, material: "Cotton", availability: "In Stock", category: "Summer", gender: "Unisex" },

  // Winter Wear
  { id: "5", name: "Wool Blend Sweater", rating: 4.7, type: "Sweater", color: "Red", size: "7", brand: "Next", price: 1200, discount: 30, material: "Wool", availability: "In Stock", category: "Winter", gender: "Girls" },
  { id: "6", name: "Padded Winter Jacket", rating: 4.6, type: "Jacket", color: "Black", size: "8", brand: "OshKosh", price: 1800, discount: 25, material: "Polyester", availability: "In Stock", category: "Winter", gender: "Boys" },

  // Sports Wear
  { id: "7", name: "Dry-Fit Sports T-Shirt", rating: 4.4, type: "T-Shirt", color: "Green", size: "10", brand: "Pantaloons Kids", price: 550, discount: 15, material: "Polyester", availability: "In Stock", category: "Sports", gender: "Unisex" },
  { id: "8", name: "Track Pants", rating: 4.3, type: "Pants", color: "Gray", size: "12", brand: "Mini Club", price: 700, discount: 20, material: "Blended", availability: "In Stock", category: "Sports", gender: "Boys" },

  // Traditional Wear
  { id: "9", name: "Cotton Panjabi Set", rating: 4.9, type: "Panjabi", color: "White", size: "4T", brand: "Carter's", price: 950, discount: 10, material: "Cotton", availability: "In Stock", category: "Others", gender: "Boys" },
  { id: "10", name: "Embroidered Frock", rating: 4.8, type: "Frock", color: "Pink", size: "3T", brand: "H&M Kids", price: 1500, discount: 30, material: "Cotton", availability: "Coming Soon", category: "Others", gender: "Girls" },

  // Toddler Essentials
  { id: "11", name: "Denim Jeans", rating: 4.2, type: "Jeans", color: "Blue", size: "2T", brand: "Gap Kids", price: 800, discount: 15, material: "Denim", availability: "In Stock", category: "Others", gender: "Unisex" },
  { id: "12", name: "Hooded Sweatshirt", rating: 4.5, type: "Hoodie", color: "Yellow", size: "14", brand: "Zara Kids", price: 900, discount: 20, material: "Cotton", availability: "In Stock", category: "Winter", gender: "Girls" },

  // Party Wear
  { id: "13", name: "Formal Shirt", rating: 4.3, type: "Shirt", color: "White", size: "XS", brand: "Next", price: 650, discount: 10, material: "Linen", availability: "In Stock", category: "Others", gender: "Boys" },
  { id: "14", name: "Velvet Party Dress", rating: 4.7, type: "Dress", color: "Purple", size: "S", brand: "OshKosh", price: 1600, discount: 35, material: "Polyester", availability: "Out of Stock", category: "Others", gender: "Girls" },

  // Basic Essential
  { id: "15", name: "Cotton Pyjama Set", rating: 4.6, type: "Pyjama", color: "Brown", size: "18-24M", brand: "Pantaloons Kids", price: 600, discount: 15, material: "Cotton", availability: "In Stock", category: "Others", gender: "Unisex" }
];

//------------------------------
// Helpers
//------------------------------
const getNumericRange = (range) => {
  if (range.includes("+")) return [parseInt(range), Infinity];
  const parts = range.match(/\d+/g);
  return parts ? [parseInt(parts[0]), parseInt(parts[1])] : [0, Infinity];
};

const filterCards = (cards, filters) => {
  return cards.filter((card) => {
    return Object.entries(filters).every(([category, values]) => {
      if (!values || values.includes("All")) return true;

      return values.some((val) => {
        const valLower = val.toLowerCase();
        const cardValue = card[category];

        // -----------------------------
        // 1. PRICE
        // -----------------------------
        if (category === "price") {
          const [min, max] = getNumericRange(val);
          return card.price >= min && card.price <= max;
        }

        // -----------------------------
        // 2. DISCOUNT
        // -----------------------------
        if (category === "discount") {
          const min = parseInt(val);
          return card.discount >= min;
        }

        // -----------------------------
        // 3. RATING
        // -----------------------------
        if (category === "rating") {
          const match = val.match(/^(\d)(?:★(?:\s*&\s*above)?)?$/);
          if (match) {
            const threshold = parseInt(match[1], 10);
            return val.includes("above")
              ? card.rating >= threshold
              : Math.floor(card.rating) === threshold;
          }
          return false;
        }

        // -----------------------------
        // 4. MATERIAL & OTHERS (with array or string)
        // -----------------------------
        if (val === "Others") {
          const validValues = (filterOptions[category] || [])
            .filter(opt => opt !== "All" && opt !== "Others")
            .map(opt => opt.toLowerCase());

          // value is an array
          if (Array.isArray(cardValue)) {
            return !cardValue.some(item => validValues.includes(item.toLowerCase()));
          }

          // value is a string
          return !validValues.includes((cardValue || "").toLowerCase());
        }

        // -----------------------------
        // 5. DEFAULT STRING / ARRAY FILTERING (case-insensitive)
        // -----------------------------
        if (Array.isArray(cardValue)) {
          return cardValue.some(item => item.toLowerCase() === valLower);
        }

        return (cardValue || "").toLowerCase() === valLower;
      });
    });
  });
};

const sortCards = (cards, sortBy) => {
  switch (sortBy) {
    case "Price: Low to High": return [...cards].sort((a, b) => a.price - b.price);
    case "Price: High to Low": return [...cards].sort((a, b) => b.price - a.price);
    case "Newest First": return [...cards].sort((a, b) => parseInt(b.id) - parseInt(a.id));
    case "Discount: High to Low": return [...cards].sort((a, b) => b.discount - a.discount);
    case "Best Selling":
    case "Customer Rating":
      return [...cards].sort((a, b) => b.rating - a.rating);
    default: return cards;
  }
};

//------------------------------
// Component
//------------------------------
const TypeBasedItemKids = () => {
  const defaultFilters = Object.keys(filterOptions).reduce((acc, key) => {
    acc[key] = ["All"];
    return acc;
  }, {});
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("Customer Rating");

  const filtered = useMemo(
    () => sortCards(filterCards(rawCards, filters), sortBy),
    [filters, sortBy]
  );

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category] || [];
      if (value === "All") return { ...prev, [category]: ["All"] };

      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== "All"), value];

      return { ...prev, [category]: updated.length ? updated : ["All"] };
    });
  };

  return (
    <div>
      <h2 className={styles.title}>Kid's Wear</h2>

      <div className={styles.filterContainer}>
        {Object.entries(filterOptions).map(([category, options]) => (
          <div className={styles.optionGroup} key={category}>
            <span className={styles.label}>
              {category.charAt(0).toUpperCase() + category.slice(1)}:
            </span>
            <div className={styles.options}>
              {options.map((item) => (
                <button
                  key={item}
                  className={`${styles.optionButton} ${
                    filters[category]?.includes(item) ? styles.active : ""
                  }`}
                  onClick={() => toggleFilter(category, item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.optionGroup}>
          <span className={styles.label}>Sort By:</span>
          <div className={styles.options}>
            {sortOptions.map((item) => (
              <button
                key={item}
                className={`${styles.optionButton} ${
                  sortBy === item ? styles.active : ""
                }`}
                onClick={() => setSortBy(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <br />

      <div className={styles.conteiner}>
        {filtered.map((card) => (
          <Link
            to={`/product/${card.id}`}
            state={{ id: `${card.id}` }}
            className={styles.cardLink}
            key={card.id}
          >
            <div className={styles.customCard}>
              <div className={styles.cardImageContainer}>
                <img src={sagorImage} alt="Card" />
                <div className={styles.cardRating}>★ {card.rating}</div>
              </div>
              <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle} title={card.name}>{card.name} - {card.color}</h3>
                  <snap className={styles.cardtype}>
                    <snap>Type: {card.type}</snap>
                    <snap>Size: {card.size}</snap>
                  </snap>
                  <p className={styles.cardBrand}>Brand: {card.brand}</p>
                  <div className={styles.cardPriceRow}>
                    <div>
                      <span className={styles.cardPrice}>৳{(card.price * (1 - card.discount / 100)).toFixed(0)}</span>
                      {card.discount > 0 && (
                        <span className={styles.cardOriginalPrice}>৳{card.price}</span>
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
    </div>
  );
};

export default TypeBasedItemKids;
