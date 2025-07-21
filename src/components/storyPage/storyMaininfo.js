
import { Col, Row, Button } from "react-bootstrap";
import "./storyMaininfo.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RatingStars from "./Rate";

export default function StoryMainInfo({ story, author, userId, chapters }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const [historyReading, setHistoryReading] = useState([]);
    const [alltags, setAllTags] = useState([]);
    const [draft, setDraft] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (!story?.id) return;

        axios
            .get(`http://localhost:9999/bookmarks?storyId=${story.id}`)
            .then((res) => setBookmarks(res.data))
            .catch(() => alert("Failed to fetch bookmarks"));

        if (userId) {
            axios
                .get(`http://localhost:9999/readingHistory?storyId=${story.id}&userId=${userId}`)
                .then((res) => {
                    const result = res.data;
                    if (Array.isArray(result) && result.length > 0) {
                        const readingData = result[0];
                        setHistoryReading(readingData.chapterOrder || []);
                    } else {
                        setHistoryReading([]);
                    }
                })
                .catch(() => setHistoryReading([]));
        }

        axios
            .get("http://localhost:9999/tags")
            .then((res) => setAllTags(res.data))
            .catch(() => alert("Failed to fetch tags"));

        axios
            .get(`http://localhost:9999/chapters/?storyId=${story.id}&isDraft=true`)
            .then((result) => setDraft(result.data?.[0] || null))
            .catch(() => setDraft(null));

       
        axios
    .get(`http://localhost:9999/ratings?storyId=${story.id}`)
    .then((res) => {
        const ratingData = res.data;
        
        console.log("Ratings: ", ratingData);
        if (ratingData.length > 0) {
            let total =0 ;
             ratingData?.map(r => {
                total += r.score;
             }
             )
            const avg = (total / ratingData.length).toFixed(1);
            setAverageRating(avg);
        }

        if (userId) {
            const found = ratingData.find((r) => String(r.userId) === String(userId));
            if (found) setUserRating(found.score);
            else {
                setUserRating( -1);
            }
        }
    })
    .catch(() => {
        setAverageRating(0);
    });

    }, [story?.id, userId]);
    useEffect(() => {
    if (!story?.id) return;

    axios
        .get(`http://localhost:9999/ratings?storyId=${story.id}`)
        .then((res) => {
            const ratingData = res.data;

            if (ratingData.length > 0) {
                let total = 0;
                ratingData.forEach(r => total += r.score);
                const avg = (total / ratingData.length).toFixed(1);
                setAverageRating(avg);
            } else {
                setAverageRating(0);
            }
        })
        .catch((err) => {
            console.error("Lỗi tính lại averageRating:", err);
            setAverageRating(0);
        });
}, [userRating]);

    useEffect(() => {
        if (userId && bookmarks.length > 0) {
            const found = bookmarks.find((b) => String(b.userId) === String(userId));
            setIsFollowed(!!found);
        }
    }, [bookmarks, userId]);

    const handleBookmark = () => {
        if (!userId) {
            alert("Bạn phải đăng nhập để theo dõi!");
            return;
        }

        const found = bookmarks.find(
            (b) =>
                String(b.userId) === String(userId) &&
                String(b.storyId) === String(story.id)
        );

        if (!found) {
            const newBookmark = { userId: String(userId), storyId: String(story.id) };
            axios
                .post("http://localhost:9999/bookmarks", newBookmark)
                .then(() => axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`))
                .then((res) => setBookmarks(res.data))
                .catch((err) => console.log("Bookmark error", err));
        } else {
            axios
                .delete(`http://localhost:9999/bookmarks/${found.id}`)
                .then(() => axios.get(`http://localhost:9999/bookmarks?storyId=${story.id}`))
                .then((res) => setBookmarks(res.data))
                .catch((err) => console.log("Unbookmark error", err));
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
        const chapterFound = chapters.find(
            (c) => Number(c.order) === Number(lastOrder)
        );

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
                    src={story.coverImage || "/book-icon.png"}
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
                        <span><strong>Tác giả:</strong> {author?.username || "Đang tải..."}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-check-circle"></i>
                        <span><strong>Trạng thái:</strong> {story.status}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-eye"></i>
                        <span><strong>Lượt Đọc:</strong> {story.totalViews}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-heart"></i>
                        <span><strong>Theo dõi:</strong> {bookmarks.length}</span>
                    </div>
                    <div className="story-info-item">
                        <i className="bi bi-star"></i>
                        <span><strong>Đánh giá trung bình:</strong> {averageRating}  /  5</span>
                    </div>
                </div>

                <div className="mb-3">
                    {story?.tags?.map((tagId, idx) => {
                        const foundTag = alltags.find((tag) => tag.id === tagId);
                        return foundTag ? (
                            <span key={idx} className="badge text-dark me-2 mb-1 tag-badge">
                                {foundTag.name.toUpperCase()}
                            </span>
                        ) : null;
                    })}
                </div>

                <RatingStars customRate={userRating} setRating ={setUserRating}  userId={userId }
  storyId={story?.id}/>

                <div className="d-flex gap-2 flex-wrap mb-3">
                    <Button onClick={startReading} className="story-button read-from-start">
                        <i className="bi bi-book"></i> Đọc từ đầu
                    </Button>
                    <Button onClick={continueReading} className="story-button continue-reading">
                        <i className="bi bi-bookmark"></i> Đọc tiếp
                    </Button>
                    <Button
                        className={`story-button follow-button ${isFollowed ? "followed" : "not-followed"}`}
                        onClick={handleBookmark}
                    >
                        <i className={`bi ${isFollowed ? "bi-heart-fill" : "bi-heart"}`}></i> Theo dõi
                    </Button>
                    {author?.id === userId && (
                        <>
                            {!draft && (
                                <Button className="story-button" onClick={() => navigate(`/write-chapter/${story.id}`)}>
                                    Viết chương mới
                                </Button>
                            )}
                            {draft?.id && (
                                <Button className="story-button" onClick={() => navigate(`/edit-chapter/${story.id}/${draft.id}`)}>
                                    Viết tiếp chương {draft.order || "?"}
                                </Button>
                            )}
                        </>
                    )}

                    {/* 
                     Button to report the story,
                    if the userid is not author.id, then have a button to report the story,
                    if the userid is admin or author, then have a button to see all the report of the story */}
                    {
                        // userId == null ? null :
                            <Button
                                className="story-button report-button"
                                variant="danger"
                                onClick={() => navigate(`/report-story/${story.id}`)}
                            >
<<<<<<< HEAD
                                <i className="bi bi-flag"></i> {author?.id !== userId ? "Báo cáo" : "Xem báo cáo"}
=======
                                <i className="bi bi-flag"></i> {author?.id !== userId? "Báo cáo" : "Xem báo cáo"}
>>>>>>> origin/main
                            </Button>
                    }

                </div>
            </Col>
        </Row>
    );
}
