import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function StoryPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/stories")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error("Lỗi load stories:", err));
  }, []);

  return (
    <Container fluid className="bg-dark text-light py-4 min-vh-100">
      <Row>
        {/* Lề trái */}
        <Col md={2}></Col>

        {/* Nội dung chính */}
        <Col md={8}>
          <Row xs={1} md={2} className="g-3">
            {stories.map((story) => (
              <Col key={story.id}>
                <Card className="bg-secondary border-0 text-light p-2" style={{ minHeight: "160px" }}>
                  <div className="d-flex">
                    {/* Ảnh */}
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="rounded"
                      style={{
                        width: "90px",
                        height: "120px",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />

                    {/* Nội dung */}
                    <div className="ms-3 d-flex flex-column justify-content-between w-100">
                      <div>
                        <div className="fw-bold fs-6">{story.title}</div>
                        <div className="text-truncate-3 small text-light-emphasis">
                          {story.description}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="small text-muted">
                          <i className="bi bi-person-fill me-1"></i>
                          {story.authorName || "Ẩn danh"} <br />
                          {story.totalChapters || 0} chương
                        </div>
                        <Button size="sm" variant="warning">
                          Đọc thử
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Lề phải */}
        <Col md={2}></Col>
      </Row>
    </Container>
  );
}
