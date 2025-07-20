import { useState } from "react";

export default function RatingStars({ customRate }) {
  const [hoveredRate, setHoveredRate] = useState(0);

  const getStarClass = (index) => {
    const rate = hoveredRate || customRate;

    if (index < Math.floor(rate)) {
      return "bi-star-fill";
    } else if (index < rate) {
      return "bi-star-half";
    } else {
      return "bi-star";
    }
  };

  return (
    <div className="mb-3">
      {[...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`bi ${getStarClass(index)} text-warning me-1`}
          style={{ cursor: "pointer", fontSize: "2rem" }}
          onMouseEnter={() => setHoveredRate(index + 1)}
          onMouseLeave={() => setHoveredRate(0)}
        ></i>
      ))}
    </div>
  );
}
