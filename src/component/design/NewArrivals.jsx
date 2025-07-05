// NewArrivals.jsx
import React, { useMemo, useState } from "react";
import styles from "./TypeBasedItem.module.css";
import sagorImage from "/home/rafiul/Desktop/react project/one-to-one-chat/src/assets/Pasted image (5).png";
import { Link } from "react-router-dom";

const filterOptions = {
  category: [
    "All","Formal", "Summer", "Winter","Sportswear","Festival","Wedding","Party","Others"
  ],
  type: [
    "All", "T-Shirt", "Shirt", "Pants", "Jeans", "Jacket", "Blazer", "Sweater", "Hoodie",
    "Panjabi", "Sherwani",
    "Shorts", "Polo Shirt","Traditional", "Others",
  ],
  color: [
    "All", "White", "Black", "Gray", "Blue", "Red", "Yellow", "Green",
    "Pink", "Purple", "Orange", "Brown", "Maroon", "Olive", "Navy", "Others",
  ],
  size: [
    "All", "S", "M", "L", "XL", "XXL", "3XL", "4XL",
    "28", "30", "32", "34", "36", "38", "40","42","44","Others",
  ],
  brand: [
    "All", "Aarong",
     "Dorjibari", "Texmart", "Easy", "Boss", "Others",
  ],
  material: [
    "All", "Cotton", "Denim", "Linen", "Silk", "Wool", "Polyester", "Blended", "Others",
  ],
  price: [
    "All", "Under 500", "500 - 999", "1000 - 1999", "2000 - 2999",
    "3000 - 4999", "5000+",
  ],
  rating: ["All", "5★", "4★ & above", "3★ & above", "2★ & above", "1★ & above"],
  availability: ["All", "In Stock", "Out of Stock", "Incoming"],
  discount: [
    "All","5% or more", "10% or more", "20% or more", "30% or more", "50% or more", "70% or more",
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
  // T-Shirts
  { id: "1", name: "Star Trek", rating: 4.5, type: "T-Shirt", color: "Black", size: "M", brand: "Aarong", price: 700, discount: 10, material: "Cotton", availability: "In Stock", category: "Summer" },
  { id: "2", name: "Graphic Print Tee", rating: 4.2, type: "T-Shirt", color: "White", size: "L", brand: "Texmart", price: 650, discount: 5, material: "Cotton", availability: "In Stock", category: "Summer" },
  { id: "3", name: "Vintage Logo", rating: 3.9, type: "T-Shirt", color: "Gray", size: "XL", brand: "Easy", price: 800, discount: 15, material: "Cotton", availability: "In Stock", category: "Summer" },
  { id: "4", name: "Pocket Basic", rating: 4.0, type: "T-Shirt", color: "Navy", size: "S", brand: "Boss", price: 900, discount: 0, material: "Cotton", availability: "In Stock", category: "Summer" },

  // Shirts
  { id: "5", name: "Snow Eagle", rating: 4.7, type: "Shirt", color: "White", size: "L", brand: "Yellow", price: 1200, discount: 12, material: "Linen", availability: "In Stock", category: "Formal" },
  { id: "6", name: "Classic Oxford", rating: 4.3, type: "Shirt", color: "Blue", size: "M", brand: "Aarong", price: 1500, discount: 10, material: "Cotton", availability: "In Stock", category: "Formal" },
  { id: "7", name: "Denim Shirt", rating: 4.1, type: "Shirt", color: "Blue", size: "XL", brand: "Texmart", price: 1800, discount: 20, material: "Denim", availability: "In Stock", category: "Casual" },
  { id: "8", name: "Floral Print", rating: 3.8, type: "Shirt", color: "Pink", size: "S", brand: "Easy", price: 1100, discount: 5, material: "Polyester", availability: "Out of Stock", category: "Summer" },

  // Pants & Jeans
  { id: "9", name: "Red Sky", rating: 2.0, type: "Jeans", color: "Blue", size: "XL", brand: "Cats Eye", price: 1500, discount: 13, material: "Denim", availability: "Out of Stock", category: "Winter" },
  { id: "10", name: "Slim Fit Chinos", rating: 4.4, type: "Pants", color: "Black", size: "32", brand: "Aarong", price: 2000, discount: 15, material: "Cotton", availability: "In Stock", category: "Formal" },
  { id: "11", name: "Cargo Pants", rating: 4.0, type: "Pants", color: "Olive", size: "34", brand: "Texmart", price: 1700, discount: 10, material: "Cotton", availability: "In Stock", category: "Casual" },
  { id: "12", name: "Skinny Jeans", rating: 3.7, type: "Jeans", color: "Black", size: "30", brand: "Easy", price: 2200, discount: 25, material: "Denim", availability: "In Stock", category: "Casual" },

  // Jackets & Outerwear
  { id: "13", name: "Remember Me", rating: 4.3, type: "Jacket", color: "Red", size: "S", brand: "Richman", price: 2500, discount: 14, material: "Polyester", availability: "In Stock", category: "Winter" },
  { id: "14", name: "Bomber Jacket", rating: 4.6, type: "Jacket", color: "Black", size: "M", brand: "Boss", price: 3500, discount: 20, material: "Polyester", availability: "In Stock", category: "Winter" },
  { id: "15", name: "Denim Jacket", rating: 4.2, type: "Jacket", color: "Blue", size: "L", brand: "Texmart", price: 2800, discount: 15, material: "Denim", availability: "In Stock", category: "Winter" },
  { id: "16", name: "Leather Jacket", rating: 4.8, type: "Jacket", color: "Black", size: "XL", brand: "Richman", price: 6500, discount: 30, material: "Leather", availability: "In Stock", category: "Winter" },

  // Sportswear
  { id: "21", name: "Sporty Runner", rating: 4.1, type: "Tracksuit", color: "Blue", size: "M", brand: "Richman", price: 2000, discount: 12, material: "Polyester", availability: "In Stock", category: "Sportswear" },
  { id: "22", name: "Gym Shorts", rating: 3.9, type: "Shorts", color: "Black", size: "L", brand: "Texmart", price: 800, discount: 10, material: "Polyester", availability: "In Stock", category: "Sportswear" },
  { id: "23", name: "Running T-Shirt", rating: 4.0, type: "T-Shirt", color: "Red", size: "XL", brand: "Easy", price: 900, discount: 5, material: "Polyester", availability: "In Stock", category: "Sportswear" },
  { id: "24", name: "Training Pants", rating: 4.2, type: "Pants", color: "Gray", size: "M", brand: "Boss", price: 1500, discount: 15, material: "Blended", availability: "In Stock", category: "Sportswear" },

  // Winter Wear
  { id: "25", name: "Winter Bliss", rating: 4.8, type: "Sweater", color: "Gray", size: "M", brand: "Ecstasy", price: 3200, discount: 20, material: "Wool", availability: "In Stock", category: "Winter" },
  { id: "26", name: "Woolen Hoodie", rating: 4.5, type: "Hoodie", color: "Black", size: "L", brand: "Aarong", price: 2800, discount: 25, material: "Wool", availability: "In Stock", category: "Winter" },
  { id: "27", name: "Thermal Jacket", rating: 4.6, type: "Jacket", color: "Navy", size: "XL", brand: "Richman", price: 4500, discount: 30, material: "Polyester", availability: "In Stock", category: "Winter" },
  { id: "28", name: "Fleece Sweater", rating: 4.3, type: "Sweater", color: "Maroon", size: "M", brand: "Texmart", price: 2200, discount: 15, material: "Wool", availability: "In Stock", category: "Winter" },

  
  // Festival & Wedding
  { id: "33", name: "Silk Sherwani", rating: 4.9, type: "Sherwani", color: "Gold", size: "M", brand: "Dorjibari", price: 7500, discount: 35, material: "Silk", availability: "In Stock", category: "Wedding" },
  { id: "34", name: "Embroidered Kurta", rating: 4.7, type: "Panjabi", color: "White", size: "L", brand: "Yellow", price: 3500, discount: 25, material: "Cotton", availability: "In Stock", category: "Festival" },
  { id: "35", name: "Traditional Dhoti", rating: 4.5, type: "Dhoti", color: "White", size: "XL", brand: "Aarong", price: 1200, discount: 10, material: "Cotton", availability: "In Stock", category: "Wedding" },
  { id: "36", name: "Festive Kurta", rating: 4.3, type: "Panjabi", color: "Green", size: "M", brand: "Dorjibari", price: 2800, discount: 20, material: "Silk", availability: "In Stock", category: "Festival" },
  { id: "17", name: "Summer Breeze", rating: 4.2, type: "Panjabi", color: "White", size: "L", brand: "Aarong", price: 1800, discount: 15, material: "Cotton", availability: "In Stock", category: "Festival" },
  { id: "18", name: "Festive Shine", rating: 4.7, type: "Sherwani", color: "Maroon", size: "XL", brand: "Yellow", price: 5500, discount: 30, material: "Silk", availability: "In Stock", category: "Wedding" },
  { id: "19", name: "Wedding Kurta", rating: 4.5, type: "Panjabi", color: "Blue", size: "M", brand: "Dorjibari", price: 2500, discount: 20, material: "Silk", availability: "In Stock", category: "Festival" },
  { id: "20", name: "Embroidered Kurta", rating: 4.3, type: "Panjabi", color: "Black", size: "L", brand: "Aarong", price: 2200, discount: 15, material: "Cotton", availability: "In Stock", category: "Festival" },
  // Blazers & Formal
  { id: "37", name: "Casual Classic", rating: 3.8, type: "Blazer", color: "Black", size: "L", brand: "Cats Eye", price: 4000, discount: 18, material: "Wool", availability: "In Stock", category: "Formal" },
  { id: "38", name: "Slim Fit Blazer", rating: 4.2, type: "Blazer", color: "Navy", size: "M", brand: "Boss", price: 4500, discount: 20, material: "Wool", availability: "In Stock", category: "Formal" },
  { id: "39", name: "Double Breasted", rating: 4.0, type: "Blazer", color: "Gray", size: "XL", brand: "Richman", price: 5000, discount: 25, material: "Wool", availability: "In Stock", category: "Formal" },
  { id: "40", name: "Linen Blazer", rating: 3.9, type: "Blazer", color: "Blue", size: "L", brand: "Aarong", price: 3800, discount: 15, material: "Linen", availability: "In Stock", category: "Formal" }
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

      if (category === "price") {
        return values.some((range) => {
          const [min, max] = getNumericRange(range);
          return card.price >= min && card.price <= max;
        });
      }

      if (category === "discount") {
        return values.some((range) => {
          const min = parseInt(range);
          return card.discount >= min;
        });
      }

      if (category === "rating") {
        return values.some((val) => {
          const match = val.match(/^(\d)(?:★(?:\s*&\s*above)?)?$/);
          if (match) {
            const threshold = parseInt(match[1], 10);
            return val.includes("above")
              ? card.rating >= threshold
              : Math.floor(card.rating) === threshold;
          }
          return false;
        });
      }

      if (category === "material") {
        return values.some((val) => {
          if (val === "Others") {
            return !filterOptions.material.includes(card.material);
          }
          return card.material === val;
        });
      }

      return values.some((val) => {
        if (val === "Others") {
          const valid = filterOptions[category].filter(opt => opt !== "All" && opt !== "Others");
          return !valid.includes(card[category]);
        }
        return card[category] === val;
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
const NewArrivals = () => {
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
      <h2 className={styles.title}>Mes's Wear</h2>

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
            to={`card/${card.id}`}
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

export default NewArrivals;
