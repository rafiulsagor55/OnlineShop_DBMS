import React, { useMemo, useState, useEffect, useContext } from "react";
import styles from "./TypeBasedItem.module.css";
import { Link, Outlet, useLocation } from "react-router-dom"; // Add useLocation
import { UserContext } from "../UserContext";

const filterOptions = {
  category: [
    "All", "Formal", "Summer", "Winter", 
    "Sportswear", "Party", "Others"
  ],
  type: [
    "All", "T-Shirt", "Top", "Jeans", "Pants", "Dress", 
    "Jacket", "Sweater", "Hoodie", "Shorts", 
    "Saree", "Salwar Kameez", "Lehenga", "Traditional", "Others"
  ],
  color: [
    "All", "White", "Black", "Gray", "Blue", "Red", "Yellow", "Green",
    "Pink", "Purple", "Orange", "Brown", "Maroon", "Beige", "Navy", "Others"
  ],
  size: [
    "All", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL",
    "28", "30", "32", "34", "36", "38", "40", "42", "44", "Others"
  ],
  brand: [
    "All", "Aarong", "Kay Kraft", "Yellow", "Ecstasy", "Le Reve", 
    "Richman", "Dorjibari", "Texmart", "Easy", "Others"
  ],
  material: [
    "All", "Cotton", "Denim", "Linen", "Silk", "Wool", 
    "Polyester", "Chiffon", "Georgette", "Velvet", "Others"
  ],
  price: [
    "All", "Under 500", "500 - 999", "1000 - 1999", "2000 - 2999",
    "3000 - 4999", "5000 - 9999", "10000+"
  ],
  rating: ["All", "5★", "4★ & above", "3★ & above", "2★ & above", "1★ & above"],
  availability: ["All", "In Stock", "Out of Stock", "Pre-Order"],
  discount: [
    "All", "5% or more", "10% or more", "20% or more", 
    "30% or more", "50% or more", "70% or more"
  ],
};

const sortOptions = [
  "Best Selling", "Customer Rating", "Newest First",
  "Discount: High to Low", "Price: Low to High", "Price: High to Low",
];

const TypeBasedItemUnisex = () => {
  const { searchItem } = useContext(UserContext);
  const [filters, setFilters] = useState({
    category: ["All"],
    type: ["All"],
    color: ["All"],
    size: ["All"],
    brand: ["All"],
    material: ["All"],
    price: ["All"],
    rating: ["All"],
    availability: ["All"],
    discount: ["All"],
  });
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState(filterOptions);
  const [sortBy, setSortBy] = useState("Customer Rating");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get current location

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const myString = "Unisex";
        const response = await fetch(`http://localhost:8080/api/filters/get-filters?gender=${encodeURIComponent(myString)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Failed to fetch filters");
        }

        const data = await response.json();
        setDynamicFilterOptions({
          category: data.category?.length ? ["All", ...data.category, "Others"] : filterOptions.category,
          type: data.type?.length ? ["All", ...data.type, "Others"] : filterOptions.type,
          color: data.color?.length ? ["All", ...data.color, "Others"] : filterOptions.color,
          size: data.size?.length ? ["All", ...data.size, "Others"] : filterOptions.size,
          brand: data.brand?.length ? ["All", ...data.brand, "Others"] : filterOptions.brand,
          material: data.material?.length ? ["All", ...data.material, "Others"] : filterOptions.material,
          price: data.price?.length ? ["All", ...data.price] : filterOptions.price,
          rating: data.rating?.length ? ["All", ...data.rating] : filterOptions.rating,
          availability: data.availability?.length ? ["All", ...data.availability] : filterOptions.availability,
          discount: data.discount?.length ? ["All", ...data.discount] : filterOptions.discount,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products/get-all-unisex-products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNumericRange = (range) => {
    if (range.includes("+")) return [parseInt(range), Infinity];
    const parts = range.match(/\d+/g);
    return parts ? [parseInt(parts[0]), parseInt(parts[1])] : [0, Infinity];
  };

  const filterCards = (cards, filters, searchItem = "") => {
    return cards.filter((card) => {
      if (searchItem) {
        const searchLower = searchItem.toLowerCase();
        if (
          !card.name.toLowerCase().includes(searchLower) &&
          !card.type.toLowerCase().includes(searchLower) &&
          !card.brand.toLowerCase().includes(searchLower) &&
          !card.id.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      return Object.entries(filters).every(([category, values]) => {
        if (!values || values.includes("All")) return true;

        return values.some((val) => {
          const valLower = val.toLowerCase();
          const cardValue = card[category];

          if (category === "price") {
            const [min, max] = getNumericRange(val);
            return card.price >= min && card.price <= max;
          }

          if (category === "discount") {
            const min = parseInt(val);
            return card.discount >= min;
          }

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

          if (val === "Others") {
            const validValues = (dynamicFilterOptions[category] || [])
              .filter(opt => opt !== "All" && opt !== "Others")
              .map(opt => opt.toLowerCase());

            if (Array.isArray(cardValue)) {
              return !cardValue.some(item => validValues.includes(item.toLowerCase()));
            }

            return !validValues.includes((cardValue || "").toLowerCase());
          }

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

  const filtered = useMemo(
    () => sortCards(filterCards(products, filters, searchItem), sortBy),
    [filters, sortBy, products, searchItem]
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

  if (loading) return <div>Loading...</div>;

  // Check if the current path is exactly "/Womens-Wear"
  const isWomensWearPage = location.pathname === "/Unisex-Wear";

  return (
    <>
      <Outlet />
      {isWomensWearPage && (
        <div>
          <h2 className={styles.titleMain}>Unisex Wear</h2>

          <div className={styles.filterContainer}>
            {/* Desktop Filter and Sort Options */}
            <div className={styles.desktopFilters}>
              {Object.entries(dynamicFilterOptions).map(([category, options]) => (
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

            {/* Mobile Filter and Sort Dropdowns */}
            <div className={styles.mobileFilterContainer}>
              <div className={`${styles.dropdownWrapper} ${styles.filterDropdownWrapper}`}>
                <input
                  type="checkbox"
                  id="filterToggle"
                  className={styles.dropdownToggle}
                />
                <label htmlFor="filterToggle" className={styles.dropdownLabel}>
                  Filter
                </label>
                <div className={styles.dropdownContent}>
                  {Object.entries(dynamicFilterOptions).map(([category, options]) => (
                    <div className={styles.subDropdownWrapper} key={category}>
                      <input
                        type="checkbox"
                        id={`subFilter-${category}`}
                        className={styles.subDropdownToggle}
                      />
                      <label
                        htmlFor={`subFilter-${category}`}
                        className={styles.subDropdownLabel}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </label>
                      <div className={styles.subDropdownContent}>
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
                </div>
              </div>

              <div className={`${styles.dropdownWrapper} ${styles.sortDropdownWrapper}`}>
                <input
                  type="checkbox"
                  id="sortToggle"
                  className={styles.dropdownToggle}
                />
                <label htmlFor="sortToggle" className={styles.dropdownLabel}>
                  Sort By
                </label>
                <div className={styles.dropdownContent}>
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
          </div>

          <br />

          <div className={styles.conteiner}>
            {filtered.map((card) => (
              <Link
                to={`${card.id}`}
                state={{ id: `${card.id}` }}
                className={styles.cardLink}
                key={card.id}
              >
                <div className={styles.customCard}>
                  <div className={styles.cardImageContainer}>
                    <img 
                      src={`${card.imageData}`} 
                      alt="Product" 
                    />
                    <div className={styles.cardRating}>★ {card.rating}</div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle} title={card.name}>{card.name}</h3>
                    <div className={styles.cardtype}>
                      <span>Type: {card.type}</span>
                      <span className={styles.cardBrand}>Brand: {card.brand}</span>
                    </div>
                    <div className={styles.cardPriceRow}>
                      <div>
                        <span className={styles.cardPrice}>৳{(card.price * (1 - card.discount / 100)).toFixed(0)}</span>
                        {card.discount > 0 && (
                          <span className={styles.cardOriginalPrice}>৳{card.price}</span>
                        )}
                      </div>
                      {card.discount > 0 && (
                        <span className={styles.cardDiscount}>
                          Save ৳{card.price - (card.price * (1 - card.discount / 100)).toFixed(0)} ({card.discount}% OFF)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TypeBasedItemUnisex;