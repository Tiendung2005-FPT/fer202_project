import { Col, Row, Button } from "react-bootstrap";
import "./storyMaininfo.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StoryMainInfo({ story, author, userId, chapters }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const [historyReading, setHistoryReading] = useState([]);
    const [alltags, setAllTags] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!story?.id || !userId) return;

        axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`)
            .then(res => setBookmarks(res.data))
            .catch(() => alert("Failed to fetch bookmarks"));

        axios.get(`http://localhost:9999/readingHistory?storyId=${story.id}&userId=${userId}`)
            .then(res => {
                const result = res.data;
                if (Array.isArray(result) && result.length > 0) {
                    const readingData = result[0];
                    if (Array.isArray(readingData.chapterOrder)) {
                        setHistoryReading(readingData.chapterOrder);
                    } else {
                        setHistoryReading([]);
                    }
                } else {
                    setHistoryReading([]);
                }
            })
            .catch(() => {
                console.error("ailed to fetch reading history");
                setHistoryReading([]);
            });


        axios.get("http://localhost:9999/tags")
            .then(res => setAllTags(res.data))
            .catch(() => alert("Failed to fetch tags"));
    }, [story?.id, userId]);

    useEffect(() => {
        if (userId && bookmarks.length > 0) {
            const found = bookmarks.find(b =>
                String(b.userId) === String(userId)
            );
            setIsFollowed(!!found);
        }
    }, [bookmarks, userId]);

    const handleBookmark = () => {
        const found = bookmarks.find(b =>
            String(b.userId) === String(userId) &&
            String(b.storyId) === String(story.id)
        );

        if (!found) {
            const newBookmark = { userId: String(userId), storyId: String(story.id) };
            axios.post("http://localhost:9999/bookmarks", newBookmark)
                .then(() => axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`))
                .then(res => setBookmarks(res.data))
                .catch(err => console.log("Bookmark error", err));
        } else {
            axios.delete(`http://localhost:9999/bookmarks/${found.id}`)
                .then(() => axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`))
                .then(res => setBookmarks(res.data))
                .catch(err => console.log("Unbookmark error", err));
        }
    };

    const startReading = () => {
        navigate(`/readStory/${story.id}/1`);
    };

    const continueReading = () => {
        if (!historyReading || historyReading.length === 0) {
            navigate(`/readStory/${story.id}/1`);
            return;
        }

        const lastOrder = historyReading[historyReading.length - 1];
        const chapterFound = chapters.find(c => Number(c.order) === Number(lastOrder));

        if (chapterFound) {
            navigate(`/readStory/${story.id}/${chapterFound.order}`);
        } else {
            navigate(`/readStory/${story.id}/1`);
        }
    };

    return (
        <Row>
            <Col md={3} xs={12} className="text-center mb-3">
                <img
                    src={story.coverImage}
                    alt="Cover"
                    className="img-fluid rounded"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                />
            </Col>

            <Col md={9} xs={12}>
                <h2>{story.title}</h2>

                <div className="story-info mb-3">
                    <div className="story-info-item">
                        <i className="bi bi-person"></i>
                        <span>Tác giả: {author?.username || "Đang tải..."}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-check-circle"></i>
                        <span>Trạng thái: {story.status}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-eye"></i>
                        <span>Lượt Đọc: {story.totalViews}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-heart"></i>
                        <span>Theo dõi: {bookmarks.length}</span>
                    </div>
                </div>

                <div className="mb-3">
                    {story?.tags?.map((tagId, idx) => {
                        const foundTag = alltags.find(tag => tag.id === tagId);
                        return foundTag ? (
                            <span key={idx} className="badge text-dark me-2 mb-1 tag-badge">
                                {foundTag.name.toUpperCase()}
                            </span>
                        ) : null;
                    })}
                </div>

                <div className="mb-3">
                    {[...Array(5)].map((_, index) => (
                        <i
                            key={index}
                            className="bi bi-star-fill text-warning me-1"
                            style={{ cursor: "pointer", fontSize: '2rem' }}
                        ></i>
                    ))}
                </div>

                <div className="d-flex gap-2 flex-wrap mb-3">
                    <Button onClick={startReading} className="story-button read-from-start">
                        <i className="bi bi-book"></i> Đọc từ đầu
                    </Button>
                    <Button onClick={continueReading} className="story-button continue-reading">
                        <i className="bi bi-bookmark"></i> Đọc tiếp
                    </Button>
                    <Button
                        className={`story-button follow-button ${isFollowed ? 'followed' : 'not-followed'}`}
                        onClick={handleBookmark}
                    >
                        <i className={`bi ${isFollowed ? 'bi-heart-fill' : 'bi-heart'}`}></i> Theo dõi
                    </Button>
                </div>
            </Col>
        </Row>
    );
}
