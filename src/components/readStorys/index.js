import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Content from "./content";
import Nav from "./nav";
import "./index.css";

export default function ReadStory() {
    const { storyId, chapterId } = useParams();

    const [story, setStory] = useState();
    const [chapter, setChapter] = useState();
    const [author, setAuthor] = useState();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("light");

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

                const foundChapter = chaptersData.find(
                    (c) => String(c.id) === String(chapterId)
                );
                setChapter(foundChapter);

                if (storyData?.authorId) {
                    const authorRes = await axios.get(
                        `http://localhost:9999/users?id=${storyData.authorId}`
                    );
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
        <Container fluid className={`read-container theme-${theme}`}>
            <div className="flex-fill-wrapper">
                <Row>
                    <Col md={1}></Col>
                    <Col md={10}>
                        {loading ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <Card className="p-4 read-card">
                                <Content
                                    chapter={chapter}
                                    storyTilte={story?.title}
                                    author={author?.username}
                                />
                            </Card>
                        )}
                    </Col>
                    <Col md={1}></Col>
                </Row>
            </div>

            <Nav
                storyId={storyId}
                currentChapter={parseInt(chapterId)}
                chapters={chapters}
                theme={theme}
                setTheme={setTheme}
            />
        </Container>

    );
}
