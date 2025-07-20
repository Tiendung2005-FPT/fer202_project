import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Content from "./content";
import Nav from "./nav";
import CommentSection from "./comments"
import "./index.css";

export default function ReadStory() {
    const { storyId, chapterId } = useParams();
    const navigate = useNavigate();

    const [story, setStory] = useState([]);
    const [chapter, setChapter] = useState();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("light");
    const [fontText, setFontText] = useState("time-new-romance");
    const [size, setSize] = useState(20);

    const [comments, setComments] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("userAccount");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        if (!storyId || !chapterId) return;

        axios.get(`http://localhost:9999/stories?id=${storyId}`)
            .then(res => setStory(res.data[0]))
            .catch(() => alert("Không thể lấy dữ liệu truyện"));

        axios.get(`http://localhost:9999/chapters?storyId=${storyId}`)
            .then(res => {
                const chapterAll = res.data?.filter(c => !c.isDraft);
                setChapters(chapterAll);

                const chapterRead = chapterAll.find(c => c.order == chapterId);
                if (!chapterRead) {
                    alert("Chương không tồn tại hoặc chỉ có bản nháp.");
                    navigate(`/storypage/${storyId}`);
                    return;
                }

                setChapter(chapterRead);
                setLoading(false);
            })
            .catch(() => {
                alert("Không thể lấy dữ liệu chương truyện");
                setLoading(false);
            });
    }, [storyId, chapterId]);

    useEffect(() => {
        if (!storyId || !chapter?.id) return;
        axios.get(`http://localhost:9999/comments?storyId=${storyId}&chapterId=${chapter.id}`)
            .then(res => setComments(res.data))
            .catch(() => console.error("Lỗi lấy comments"));
    }, [storyId, chapter?.id]);

    useEffect(() => {
        if (!storyId || !chapter?.id) return;

        const timeoutId = setTimeout(() => {
            axios.patch(`http://localhost:9999/chapters/${chapter.id}`, {
                views: chapter.views + 1
            }).catch(err => console.error("Lỗi cập nhật view chapter:", err));

            axios.patch(`http://localhost:9999/stories/${story.id}`, {
                totalViews: story.totalViews + 1
            }).catch(err => console.error("Lỗi cập nhật totalViews story:", err));

            if (!user?.id) return;

            axios.get(`http://localhost:9999/readingHistory?userId=${user.id}&storyId=${storyId}`)
                .then(res => {
                    const data = res.data?.[0];
                    if (data) {
                        const isRead = data.chapterOrder.includes(chapter.order);
                        if (!isRead) {
                            axios.patch(`http://localhost:9999/readingHistory/${data.id}`, {
                                chapterOrder: [...data.chapterOrder, chapter.order],
                                lastRead: new Date().toISOString(),
                                progress: data.progress + 1
                            }).catch(err => console.error("cập nhật ls lỗi:", err));
                        }
                    } else {
                        axios.post(`http://localhost:9999/readingHistory`, {
                            userId: user.id,
                            storyId: story.id,
                            chapterOrder: [chapter.order],
                            lastRead: new Date().toISOString(),
                            progress: 1
                        }).catch(err => console.error("Tạo mới ls lỗi:", err));
                    }
                })
                .catch(err => console.error("Lấy dữ liệu lịch sử fail", err));
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [storyId, chapter?.id, user?.id]);

    return (
        <Container fluid className={`read-container theme-${theme}`}>
            <div className="flex-fill-wrapper">
                <Row>
                    <Col md={1}></Col>
                    <Col xs={12} md={10}>
                        {loading ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <Card className={`p-4 read-card font-${fontText}`}>
                                <Content
                                    chapter={chapter}
                                    story={story}
                                    size={size}
                                />
                            </Card>
                        )}
                    </Col>
                    <Col md={1}></Col>
                </Row>
            </div>
            <Container>
                <CommentSection
                commentsData={comments}
                userId={user?.id}
                />
            </Container>

            

            <Nav
                storyId={storyId}
                currentChapterId={chapter?.id}
                chapters={chapters}
                theme={theme}
                setTheme={setTheme}
                fontText={fontText}
                setFontText={setFontText}
                size={size}
                setSize={setSize}
            />
        </Container>
    );
}
