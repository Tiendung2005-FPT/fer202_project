import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [stories, setStories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const navigate = useNavigate();

  const isAdmin = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("userAccount"));
      return user?.role === "admin";
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    axios
      .get("http://localhost:9999/stories")
      .then((res) => setStories(res.data));
    axios
      .get("http://localhost:9999/users")
      .then((res) => setAuthors(res.data));
    axios
      .get("http://localhost:9999/categories")
      .then((res) => setCategories(res.data));
    axios.get("http://localhost:9999/tags").then((res) => setTags(res.data));
  }, []);

  const getAuthorName = (authorId) => {
    const author = authors.find((a) => Number(a.id) === Number(authorId));
    return author ? author.fullname : "Unknown";
  };

  const getCategoryName = (category) => {
    const cat = categories.find((c) => c.name === category);
    return cat ? cat.name : category;
  };

  const getTagName = (tagId) => {
    const tag = tags.find((t) => String(t.id) === String(tagId));
    return tag ? tag.name : tagId;
  };

  const allTagIds = Array.from(
    new Set(stories.flatMap((story) => story.tags || []))
  );

  // Truyện không ẩn và thỏa điều kiện lọc
  const filteredStories = stories.filter((story) => {
    const matchTag = selectedTag
      ? (story.tags || []).includes(selectedTag)
      : true;
    const matchAuthor = selectedAuthor
      ? Number(story.authorId) === Number(selectedAuthor)
      : true;
    const matchCategory = selectedCategory
      ? story.category === selectedCategory
      : true;
    const notHidden = story.status !== "hidden";
    return matchTag && matchAuthor && matchCategory && notHidden;
  });

  const sortedStories = [...filteredStories]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 9);

  const updatedStories = [...stories]
    .filter((story) => story.status !== "hidden")
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 20);

  return (
    <Container style={{ maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2 className="text-center m-0">Danh Sách Truyện</h2>
        {isAdmin && (
          <div>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => navigate("/admin/add-story")}
            >
              ➕ Thêm truyện
            </Button>
            <Button
              variant="warning"
              onClick={() => navigate("/admin/hide-story")}
            >
              🛠 Sửa trạng thái
            </Button>
          </div>
        )}
      </div>

      <Row>
        <Col md={9}>
          <Row>
            {sortedStories.length === 0 && (
              <Col className="text-center text-danger">
                Không tìm thấy truyện phù hợp.
              </Col>
            )}
            {sortedStories.map((story) => (
              <Col md={4} className="mb-4" key={story.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      story.coverImage
                        ? story.coverImage.startsWith("http") ||
                          story.coverImage.startsWith("data")
                          ? story.coverImage
                          : `http://localhost:9999${story.coverImage}`
                        : "https://via.placeholder.com/220x300?text=No+Image"
                    }
                    alt={story.title}
                    style={{ height: 220, objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/220x300?text=No+Image";
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{story.title}</Card.Title>
                    <Card.Text>
                      <strong>Tác giả:</strong> {getAuthorName(story.authorId)}{" "}
                      <br />
                      <strong>Thể loại:</strong>{" "}
                      {getCategoryName(story.category)} <br />
                      <strong>Trạng thái:</strong>{" "}
                      <Badge
                        bg={
                          story.status === "completed" ? "success" : "warning"
                        }
                      >
                        {story.status === "completed"
                          ? "Hoàn thành"
                          : "Đang ra"}
                      </Badge>
                      <br />
                      <strong>Lượt xem:</strong>{" "}
                      {story.totalViews?.toLocaleString?.() || 0}
                      <br />
                      <strong>Chương:</strong> {story.totalChapters}
                      <br />
                      <strong>Đánh giá:</strong> {story.rating} ⭐
                    </Card.Text>
                    <div className="mb-2" style={{ minHeight: 32 }}>
                      {story.tags &&
                        story.tags.map((tagId) => (
                          <Badge
                            bg="info"
                            className="me-1"
                            key={tagId}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedTag(tagId)}
                          >
                            {getTagName(tagId)}
                          </Badge>
                        ))}
                    </div>
                    <Card.Text className="text-truncate">
                      {story.description}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => navigate(`/storypage/${story.id}`)}
                    >
                      Đọc truyện
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-5">
            <h4 className="mb-3">TRUYỆN MỚI CẬP NHẬT</h4>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Tên truyện</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Chương mới nhất</th>
                  <th>Lượt xem</th>
                  <th>Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {updatedStories.map((story) => (
                  <tr key={story.id}>
                    <td>
                      <a
                        href="#"
                        style={{ fontWeight: "bold" }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/storypage/${story.id}`);
                        }}
                      >
                        {story.title}
                      </a>
                      {story.isHot && (
                        <Badge bg="danger" className="ms-2">
                          Hot
                        </Badge>
                      )}
                      {story.status === "completed" && (
                        <Badge bg="success" className="ms-2">
                          Full
                        </Badge>
                      )}
                    </td>
                    <td>{getAuthorName(story.authorId)}</td>
                    <td>{getCategoryName(story.category)}</td>
                    <td>Chương {story.totalChapters}</td>
                    <td>{story.totalViews?.toLocaleString?.() || 0}</td>
                    <td>
                      {story.updatedAt
                        ? new Date(story.updatedAt).toLocaleString("vi-VN", {
                            hour12: false,
                          })
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>

        <Col md={3}>
          <h5 className="mb-3">Tags truyện</h5>
          <ListGroup>
            {allTagIds.length === 0 && (
              <ListGroup.Item>Không có tag nào</ListGroup.Item>
            )}
            {allTagIds.map((tagId) => (
              <ListGroup.Item
                key={tagId}
                action
                active={selectedTag === tagId}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedTag(tagId)}
              >
                {getTagName(tagId)}
              </ListGroup.Item>
            ))}
            {selectedTag && (
              <ListGroup.Item
                action
                variant="secondary"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedTag("")}
              >
                Xem tất cả
              </ListGroup.Item>
            )}
          </ListGroup>

          <h5 className="mt-4 mb-3">Tác giả đóng góp nhiều nhất</h5>
          <ListGroup>
            {authors.length > 0 &&
              [...authors]
                .map((author) => ({
                  ...author,
                  storyCount: stories.filter(
                    (story) =>
                      Number(story.authorId) === Number(author.id) &&
                      story.status !== "hidden"
                  ).length,
                }))
                .sort((a, b) => b.storyCount - a.storyCount)
                .slice(0, 3)
                .map((author) => (
                  <ListGroup.Item
                    key={author.id}
                    action
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedAuthor(author.id)}
                  >
                    {author.fullname}{" "}
                    <Badge bg="primary" className="ms-2">
                      {author.storyCount}
                    </Badge>
                  </ListGroup.Item>
                ))}
            {authors.length === 0 && (
              <ListGroup.Item>Không có dữ liệu tác giả</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
