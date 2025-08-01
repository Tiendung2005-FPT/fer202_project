import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StoryBreakcumb from "./breakcumb";
import StoryMainInfo from "./storyMaininfo";
import StoryDescription from "./storyDescription";
import ChapterList from "./chapterList";
import RatingStars from "./Rate"

export default function StoryPage() {
  const { id } = useParams(); 
  const [story, setStory] = useState([]);
  const [author, setAuthor] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const rawUser = localStorage.getItem("userAccount");
  const user = rawUser ? JSON.parse(rawUser) : null;

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:9999/stories?id=${id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setStory(res.data[0]);
        } else {
          alert("Không tìm thấy story với id: " + id);
        }
      })
      .catch((err) => alert("Lỗi load story: " + err));
  }, [id]);

  useEffect(() => {
    if (!story?.authorId) return;
    axios
      .get(`http://localhost:9999/users?id=${String(story.authorId)}`)
      .then((res) => {
        if (res.data.length > 0) {
          setAuthor(res.data[0]);
        } else {
          console.warn("Không tìm thấy author với id:", story.authorId);
        }
      })
      .catch((err) => console.error("Lỗi load author:", err));
  }, [story?.authorId]);

  useEffect(() => {
    if (!story?.id || !author?.id) return;
    axios
      .get(`http://localhost:9999/chapters?storyId=${story.id}`)
      .then((res) => {
        const data = res.data;
        const storyAuthorId = String(author.id);
        const currentUserId = String(user?.id); 

        if (storyAuthorId === currentUserId) {
          setChapters(data);
        } else {
          const filtered = data.filter((chap) => chap.isDraft === false);
          setChapters(filtered);
        }
      })
      .catch((err) => console.error("Lỗi load chapter:", err));
  }, [story?.id, author?.id, user?.id]);

  const toggleDesc = () => setShowFullDesc(!showFullDesc);

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={2}></Col>
        <Col md={8}>
          {story && (
            <Card className="p-4">
              <StoryBreakcumb title={story.title} id={story.id} />
              <StoryMainInfo
                story={story}
                author={author}
                userId={user?.id}
                chapters={chapters}
              />
              <StoryDescription
                description={story.description}
                showFullDesc={showFullDesc}
                onToggle={toggleDesc}
              />
              <ChapterList
                chapters={chapters}
                storyID={story.id}
                author={author}
                userId={user?.id}
              />
            </Card>
          )}
        </Col>
        <Col md={2}></Col>
      </Row>
    </Container>
  );
}
