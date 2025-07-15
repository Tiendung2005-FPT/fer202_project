import { Col, Row, Button } from "react-bootstrap";
import "./storyMaininfo.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function StoryMainInfo({ story, user }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const [historyReading, setHistoryReading] = useState([]);
    const [draft, setDraft] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!story?.id || !user?.id) return;

        axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`)
            .then(res => setBookmarks(res.data))
            .catch(() => console.log("Failed to fetch bookmarks"));

        axios.get(`http://localhost:9999/readingHistory?storyId=${story.id}&userId=${user.id}`)
            .then(res => setHistoryReading(res.data))
            .catch(() => console.log("Failed to fetch historyReading"));
        axios.get(`http://localhost:9999/chapters/?storyId=${story.id}&isDraft=true`)
            .then(result => {
                if (result.data) {
                    setDraft(result.data[0])
                }
            })
    }, [story, user]);

    useEffect(() => {
        if (user?.id) {
            const found = bookmarks.find(b => b.userId == user.id);
            setIsFollowed(!!found);
        }
    }, [bookmarks, user]);

    const handleBookmark = () => {
        const found = bookmarks.find(b => b.userId == user.id && b.storyId == story.id);
        if (!found) {
            const newBookmark = { userId: user.id, storyId: story.id };
            axios.post("http://localhost:9999/bookmarks", newBookmark)
                .then(() => {
                    return axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`);
                })
                .then(res => setBookmarks(res.data))
                .catch(err => console.log("Bookmark error", err));
        } else {
            axios.delete(`http://localhost:9999/bookmarks/${found.id}`)
                .then(() => {
                    return axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`);
                })
                .then(res => setBookmarks(res.data))
                .catch(err => console.log("Unbookmark error", err));
        }
    };
    const startReading = () => {
        navigate(`/readStory/${story.id}/1`)
    }
    const continueReading = () => {
        if (historyReading.length === 0) {
            navigate(`/readStory/${story.id}/1`)
        } else {
            navigate(`/readStory/${story.id}/${historyReading[historyReading.length - 1]}`)
        }
    }
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
                        <span>Tác giả: {user?.username || "Đang tải..."}</span>
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
                    {story?.tags?.map((tag, idx) => (
                        <span
                            key={idx}
                            className="badge text-dark me-2 mb-1  tag-badge"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mb-3">
                    {[...Array(5)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill text-warning me-1" style={{ cursor: "pointer", fontSize: '2rem' }}></i>
                    ))}
                </div>
                <div className="d-flex gap-2 flex-wrap mb-3">
                    <div className="d-flex gap-2 flex-wrap mb-3">
                        <div className="d-flex gap-2 flex-wrap mb-3">
                            <Button
                                onClick={startReading}
                                className="story-button read-from-start">
                                <i className="bi bi-book"></i> Đọc từ đầu
                            </Button>
                            <Button
                                onClick={continueReading}
                                className="story-button continue-reading">
                                <i className="bi bi-bookmark"></i> Đọc tiếp
                            </Button>
                            <Button
                                className={`story-button follow-button ${isFollowed ? 'followed' : 'not-followed'}`}
                                onClick={handleBookmark}
                            >
                                <i className={`bi ${isFollowed ? 'bi-heart-fill' : 'bi-heart'}`}></i> Theo dõi
                            </Button>
                            {!draft && (
                                <Button
                                    className="story-button"
                                    onClick={() => navigate(`/write-chapter/${story.id}`)}
                                >
                                    Viết chương mới
                                </Button>
                            )}

                            {draft && draft.id && (
                                <Button
                                    className="story-button"
                                    onClick={() => navigate(`/edit-chapter/${story.id}/${draft.id}`)}
                                >
                                    Viết tiếp chương {draft.order || "?"}
                                </Button>
                            )}

                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
}