import { Col, Row, Button } from "react-bootstrap";
import "./storyMaininfo.css";
export default function StoryMainInfo({ story, user }) {
    return (
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
                    <div><i className="bi bi-person"></i> Tác giả: <strong>{user?.username || "Đang tải..."}</strong></div>
                    <div><i className="bi bi-check-circle"></i> Trạng thái: {story.status}</div>
                    <div><i className="bi bi-heart"></i> Theo dõi: 120</div>
                </div>

                <div className="mb-3">
                    {story?.tags?.map((tag, idx) => (
                        <span
                            key={idx}
                            className="badge bg-warning text-dark me-2 mb-1 px-2 py-1 tag-badge"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mb-3">
                    {[...Array(5)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill text-warning me-1" style={{ cursor: "pointer" }}></i>
                    ))}
                </div>
                <div className="d-flex gap-2 flex-wrap mb-3">
                    <Button variant="success">📖 Đọc từ đầu</Button>
                    <Button variant="primary">📘 Đọc tiếp</Button>
                    <Button variant="warning">⭐ Theo dõi</Button>
                </div>
            </Col>
        </Row>
    );
}
