import { useState, useEffect } from "react";
import { getCategories } from "../../services/appwrite";
import "./CategoryFilter.css";

export default function CategoryFilter({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div className="category-filter">
      <button
        className={`category-filter__chip ${!selected ? "category-filter__chip--active" : ""}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-filter__chip ${selected === cat ? "category-filter__chip--active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
