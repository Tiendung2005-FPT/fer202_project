import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 

function AddStory() {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 
  useEffect(() => {
    axios.get("http://localhost:9999/tags").then((res) => setAllTags(res.data));
    axios
      .get("http://localhost:9999/categories")
      .then((res) => setAllCategories(res.data));
  }, []);

  const user = JSON.parse(localStorage.getItem("userAccount"));
  const authorId = user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Bạn cần đăng nhập để thêm truyện.");
      setSuccess("");
      return;
    }

    if (!title || !description || !category) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setSuccess("");
      return;
    }

    try {
      await axios.post("http://localhost:9999/stories", {
        title,
        coverImage,
        description,
        category,
        tags,
        authorId,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalViews: 0,
        totalChapters: 0,
        draftChapters: 0,
      });

      setSuccess("Thêm truyện thành công! Đang chuyển về trang chủ...");
      setError("");
      setTitle("");
      setCoverImage("");
      setDescription("");
      setCategory("");
      setTags([]);

      
      setTimeout(() => navigate("/home-page"), 1500);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi thêm truyện!");
      setSuccess("");
    }
  };

  return (
    <Container style={{ maxWidth: 600 }}>
      <h3 className="my-4 text-center">Thêm Truyện Mới</h3>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên truyện</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ảnh bìa (URL hoặc đường dẫn)</Form.Label>
          <Form.Control
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Thể loại</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Chọn thể loại --</option>
            {allCategories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Select
            multiple
            value={tags}
            onChange={(e) =>
              setTags(
                Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value)
                )
              )
            }
          >
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Thêm truyện
        </Button>
      </Form>
    </Container>
  );
}

export default AddStory;
