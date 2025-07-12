import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StoryPage({storyId}) {
  const [story, setStory] = useState();
  const [user, setUser] = useState();
  const [chapters, setChapters] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:9999/stories?id=1")
      .then((res) => setStory(res.data[0]))
      .catch((err) => console.error("Lỗi load stories:", err));
  }, []);

  useEffect(() => {
    if (story?.authorId) {
      axios
        .get(`http://localhost:9999/users?id=${story.authorId}`)
        .then((res) => setUser(res.data[0]))
        .catch((err) => console.error("Lỗi load user:", err));
    }
    if (story?.id) {
      axios
        .get(`http://localhost:9999/chapters?storyId=${story.id}`)
        .then((res) => setChapters(res.data))
        .catch((err) => console.error("Lỗi load chapter:", err));
    }
  }, [story]);

  const toggleDesc = () => setShowFullDesc(!showFullDesc);

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={2}></Col>
        <Col md={8}>
          {story && (
            <Card className="p-4">
              <div className="mb-3 text-muted small">
                <span>Trang chủ / {story.title}</span>
              </div>

              {/* Main */}
              <Row>
                <Col md={3} xs={12} className="text-center mb-3">
                  <img
                    src={story.coverImage}
                    alt="Cover"
                    className="img-fluid rounded"
                    style={{ maxHeight: "240px", objectFit: "cover" }}
                  />
                </Col>
                <Col md={9} xs={12}>
                  <h2>{story.title}</h2>
                  <div className="mb-2 text-muted">
                    <div>
                      <i className="bi bi-person"></i> Tác giả:{" "}
                      <strong>{user?.username || "Đang tải..."}</strong>
                    </div>
                    <div>
                      <i className="bi bi-check-circle"></i> Trạng thái: {story.status}
                    </div>
                    <div>
                      <i className="bi bi-heart"></i> Theo dõi: 120
                    </div>
                  </div>

                  <div className="mb-3">
                    {story?.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="badge bg-warning text-dark me-2 mb-1 px-2 py-1"
                        style={{ borderRadius: "0.5rem" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stars */}
                  <div className="mb-3">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className="bi bi-star-fill text-warning me-1"
                        style={{ cursor: "pointer" }}
                      ></i>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-2 flex-wrap mb-3">
                    <Button variant="success">📖 Đọc từ đầu</Button>
                    <Button variant="primary">📘 Đọc tiếp</Button>
                    <Button variant="warning">⭐ Theo dõi</Button>
                  </div>
                </Col>
              </Row>

              <div className="mt-4">
                <h5>Mô tả truyện</h5>
                {story?.description && (
                  <>
                    <p className="text-secondary">
                      {showFullDesc
                        ? story.description
                        : story.description.slice(0, 200) +
                          (story.description.length > 200 ? "..." : "")}
                    </p>
                    {story.description.length > 200 && (
                      <Button size="sm" variant="warning" onClick={toggleDesc}>
                        {showFullDesc ? "Ẩn bớt" : "Xem thêm"}
                      </Button>
                    )}
                  </>
                )}
              </div>

              <hr className="my-4" />
              <Row>
                {chapters?.map((c, i) => (
                  <div key={i} xs={12} sm={6} md={4} lg={3}>
                    <p>{c.title}</p>
                  </div>
                ))}
              </Row>
            </Card>
          )}
        </Col>
        <Col md={2}></Col>
      </Row>
    </Container>
  );
}
