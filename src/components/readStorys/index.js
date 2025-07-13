import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Content from "./content";
import Nav from "./nav";

export default function ReadStory() {
  const { storyId, chapterId } = useParams();

  const [story, setStory] = useState();
  const [chapter, setChapter] = useState();
  const [author, setAuthor] = useState();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storyId || !chapterId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [storyRes, chapterRes] = await Promise.all([
          axios.get(`http://localhost:9999/stories?id=${storyId}`),
          axios.get(`http://localhost:9999/chapters`)
        ]);

        const storyData = storyRes.data[0];
        const chaptersData = chapterRes.data;

        setStory(storyData);
        setChapters(chaptersData);

        const foundChapter = chaptersData.find(c => String(c.id) === String(chapterId));
        setChapter(foundChapter);

        if (storyData?.authorId) {
          const authorRes = await axios.get(`http://localhost:9999/users?id=${storyData.authorId}`);
          setAuthor(authorRes.data[0]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId, chapterId]);

  return (
    <Container fluid className="py-4" style={{border:"none !important"}}>
      <Row>
        <Col md={2}></Col>
        <Col md={8}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Card className="p-4" bg="light" border="light">
              <Content
                chapter={chapter}
                storyTilte={story?.title}
                author={author?.username}
              />
            </Card>
          )}
        </Col>
        <Col md={2}></Col> 
        <Nav
                storyId={storyId}
                currentChapter={parseInt(chapterId)}
                totalChapters={chapters.length}
        />
      </Row>
    </Container>
  );
}
