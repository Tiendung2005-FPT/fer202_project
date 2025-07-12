import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StoryBreakcumb from "./breakcumb";
import StoryMainInfo from "./storyMaininfo";
import StoryDescription from "./storyDescription";
import ChapterList from "./chapterList";


export default function StoryPage() {
    const  {id}  = useParams();
    const [story, setStory] = useState();
    const [user, setUser] = useState();
    const [chapters, setChapters] = useState([]);
    const [showFullDesc, setShowFullDesc] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:9999/stories?id=${id}`)
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
                                <StoryBreakcumb title={story.title} id ={story.id} />
                                <StoryMainInfo story={story} user={user} />
                                <StoryDescription
                                    description={story.description}
                                    showFullDesc={showFullDesc}
                                    onToggle={toggleDesc}
                                />
                                <ChapterList chapters={chapters} />
                            </Card>
                        )}
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    );
}
