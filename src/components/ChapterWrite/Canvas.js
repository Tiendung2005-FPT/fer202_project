import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function Canvas() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/stories")
      .then(result => setStories(result.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Danh sách truyện</h2>
      {stories.map(story => (
        <div
          key={story.id}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "6px"
          }}
        >
          <h4>{story.title}</h4>
          <p><strong>Thể loại:</strong> {story.category}</p>
          <p><strong>Mô tả:</strong> {story.description}</p>
          <p><strong>Trạng thái:</strong> {story.status === "ongoing" ? "Đang ra" : "Đã hoàn thành"}</p>
          <p><strong>Lượt xem:</strong> {story.totalViews.toLocaleString()}</p>
          <Link to={`/storypage/${story.id}`} className="btn btn-sm btn-primary">Xem chi tiết</Link>
        </div>
      ))}
    </Container>
  );
}
