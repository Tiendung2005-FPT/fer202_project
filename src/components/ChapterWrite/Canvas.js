import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function Canvas() {
  const [stories, setStories] = useState([]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/stories")
      .then(result => setStories(result.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:9999/chapters")
      .then(result => setChapters(result.data))
      .catch(err => console.error(err));
  }, []);

  // Convert storyId to string to ensure type match
  const getChaptersByStory = (storyId) => {
    return chapters.filter(chap => String(chap.storyId) === String(storyId));
  };

  return (
    <Container className="py-4">
      {stories.map(story => (
        <div key={story.id} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }}>
          <h4>{story.title}</h4>
          <Link to={`/write-chapter/${story.id}`} className="btn btn-sm btn-outline-primary mb-2">Viết chương mới</Link>

          <div>
            <strong>Danh sách chương:</strong>
            <ul style={{ marginTop: "0.5rem" }}>
              {getChaptersByStory(story.id).length === 0 ? (
                <li>Chưa có chương nào</li>
              ) : (
                getChaptersByStory(story.id).map(chap => (
                  <li key={chap.id}>
                    {chap.title || "(Không có tiêu đề)"} {chap.isDraft && <em>(Nháp)</em>}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ))}
    </Container>
  );
}
