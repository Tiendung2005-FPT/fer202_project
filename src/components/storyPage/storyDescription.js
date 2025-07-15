import { Button } from "react-bootstrap";

export default function StoryDescription({ description, showFullDesc, onToggle }) {
  if (!description) return null;

  const shortDesc = description.slice(0, 200) + (description.length > 200 ? "..." : "");

  return (
    <div className="mt-4">
      <h5>Mô tả truyện</h5>
      <p className="text-secondary">{showFullDesc ? description : shortDesc}</p>
      {description.length > 200 && (
        <Button size="sm" variant="warning" onClick={onToggle}>
          {showFullDesc ? "Ẩn bớt" : "Xem thêm"}
        </Button>
      )}
    </div>
  );
}
