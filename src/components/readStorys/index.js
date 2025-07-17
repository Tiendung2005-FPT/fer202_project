import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import Content from "./content";
import Nav from "./nav";
import "./index.css";

export default function ReadStory() {
    const { storyId, chapterId } = useParams();
    const navigate = useNavigate();

    const [story, setStory] = useState([]);
    const [chapter, setChapter] = useState();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (!storyId || !chapterId) return;
        axios.get(`http://localhost:9999/stories?id=${storyId}`)
            .then(
                res => {
                    setStory(res.data[0])

                }
            )
            .catch(
                () => {
                    alert("Không thể lấy dữ liệu truyện")
                }
            )

        axios.get(`http://localhost:9999/chapters?storyId=${storyId}`)
            .then(res => {
                const chapterall = res.data?.filter(c => (!c.isDraft))
                setChapters(chapterall)
                const chapterRead = chapterall?.find(c => (c.order == chapterId))
                if (!chapterRead || chapterRead.length === 0) {
                    alert("Chương không tồn tại hoặc chỉ có bản nháp.");
                    navigate(`/storypage/${storyId}`)
                    return;
                }
                setChapter(chapterRead)
                setLoading(false);
            })
            .catch(() => {
                alert(() => ("Không thể lấy dữ liệu chương truyện"))
                setLoading(false)
            }
            )
    }, [storyId, chapterId]);



    useEffect(() => {
        if (!storyId || !chapter?.id) return;

        const timeoutId = setTimeout(() => {
            const userId = JSON.parse(localStorage.getItem("userId"));

            axios.get(`http://localhost:9999/readingHistory?userId=${userId}&storyId=${storyId}`)
                .then(res => {
                    const data = res.data?.[0];

                    if (data) {
                        const isRead = data.chapterOrder.includes(chapter.order);

                        if (!isRead) {
                            axios.patch(`http://localhost:9999/readingHistory/${data.id}`, {
                                chapterOrder: [...data.chapterOrder, chapter.order],
                                lastRead: new Date().toISOString(),
                                progress: data.progress + 1
                            })
                                .catch(err => {
                                    console.error("cập nhật ls lỗi:", err);
                                });
                        }
                    } else {
                        axios.post(`http://localhost:9999/readingHistory`, {
                            userId,
                            storyId,
                            chapterOrder: [chapter.order],
                            lastRead: new Date().toISOString(),
                            progress: 1
                        })
                            .catch(err => {
                                console.error("Tạo mới ls  lỗi:", err);
                            });
                    }
                })
                .catch(err => {
                    console.error(" lấy dữ liệu lịch sử fail", err);
                });
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [storyId, chapter?.id]);


    useEffect(() => {
        console.log(story);      
}, [story]);


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
                                    story={story}
                                />
                            </Card>
                        )}
                    </Col>
                    <Col md={1}></Col>
                </Row>
            </div>

            <Nav
                storyId={storyId}
                currentChapterId={chapter?.id}
                chapters={chapters}
                theme={theme}
                setTheme={setTheme}
            />

        </Container>

    );
}
