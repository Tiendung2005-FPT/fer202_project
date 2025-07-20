import { useState } from "react";
import axios from "axios";

export default function RatingStars({ customRate, setRating, userId, storyId }) {
  const [hoveredRate, setHoveredRate] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const handleClick = async (rate) => {
    if(!userId) {
        alert("Bạn phải đăng nhập mới thực hiện được chức năng này")
        return;
    }
    if (loading) {
      console.log("Đang xử lý, bỏ qua click...");
      return;
    }
    setLoading(true);
    try {
      const newRating = {
        userId: String(userId),
        storyId: String(storyId),
        score: rate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (customRate < 0 ) {
        await axios.post("http://localhost:9999/ratings", newRating);
         alert("Cảm ơn đã đánh giá truyện , chúc bạn đọc truyện vui vẻ")
        
      } else {
        const res = await axios.get(
          `http://localhost:9999/ratings?userId=${userId}&storyId=${storyId}`
        );
        const rating = res.data[0];
       

        if (rating) {
          const patchData = {
            score: rate,
            updatedAt: new Date().toISOString(),
          };
          await axios.patch(`http://localhost:9999/ratings/${rating.id}`, patchData);
          alert("Đánh giá của bạn đã được cập nhật!")
        } else {
          console.warn("Không tìm thấy đánh giá cũ để cập nhật.");
        }
      }

      setRating(rate);
    } catch (error) {
      console.error("Rating error:", error);
    } finally {
      setLoading(false);
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
          onClick={() => handleClick(index + 1)}
        ></i>
      ))}
    </div>
  );
}
