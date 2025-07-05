// ClothesFilterSort.jsx
import React, { useState, useEffect } from 'react';
import styles from './ClothesFilterSort.module.css';

const filterOptions = {
  type: ['All', 'T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Jacket', 'Traditional'],
  color: ['All', 'White', 'Black', 'Blue', 'Red', 'Yellow', 'Green'],
  size: ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  brand: ['All', 'Aarong', 'Yellow', 'Cats Eye', 'Richman', 'Le Reve'],
  price: ['All', '0-500', '500-1000', '1000-2000', '2000-2500','2500+'],
  rating: ['All', '4★ & above', '3★ & above', '2★ & above', '1★ & above', '5★', '4★', '3★', '2★', '1★']
};

const sortOptions = [
  'Best Selling',
  'Customer Rating',
  'Newest First' ,
  'Discount: High to Low',
  'Price: Low to High',
  'Price: High to Low'
];

const ClothesFilterSort = ({ onFilterChange, onSortChange }) => {
  // ✅ Default "All" active for all filters
  const defaultFilters = Object.keys(filterOptions).reduce((acc, key) => {
    acc[key] = ['All'];
    return acc;
  }, {});

  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('Customer Rating');

  // 🔁 Notify parent of filter or sort changes
  useEffect(() => {
    if (onFilterChange) onFilterChange(filters);
  }, [filters]);

  useEffect(() => {
    if (onSortChange) onSortChange(sortBy);
  }, [sortBy]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category] || [];

      // If clicking "All"
      if (value === 'All') {
        return { ...prev, [category]: ['All'] };
      }

      // Toggle value
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== 'All'), value];

      return { ...prev, [category]: updated.length ? updated : ['All'] };
    });
  };

  const renderOptions = (category, options) => (
    <div className={styles.optionGroup} key={category}>
      <span className={styles.label}>{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
      <div className={styles.options}>
        {options.map((item) => (
          <button
            key={item}
            className={`${styles.optionButton} ${filters[category]?.includes(item) ? styles.active : ''}`}
            onClick={() => toggleFilter(category, item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSort = () => (
    <div className={styles.optionGroup}>
      <span className={styles.label}>Sort By:</span>
      <div className={styles.options}>
        {sortOptions.map((item) => (
          <button
            key={item}
            className={`${styles.optionButton} ${sortBy === item ? styles.active : ''}`}
            onClick={() => setSortBy(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.filterContainer}>
      {Object.entries(filterOptions).map(([category, options]) => renderOptions(category, options))}
      {renderSort()}
    </div>
  );
};

export default ClothesFilterSort;
