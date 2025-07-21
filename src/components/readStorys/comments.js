import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

export default function CommentSection({ chapterId, storyId }) {
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState([]);
    const user = JSON.parse(localStorage.getItem("userAccount"));
    useEffect(() => {
        if (!storyId || !chapterId) return;

        console.log("✅ user:", user);
        console.log("✅ storyId:", storyId, "| chapterId:", chapterId);

        axios
            .get(`http://localhost:9999/comments?storyId=${storyId}&chapterId=${chapterId}&_sort=createdAt&_order=desc`)
            .then((res) => setComments(res.data))
            .catch((err) => console.error("❌ Lỗi lấy comments:", err));
    }, [storyId, chapterId]);

    const handleLike = async (commentId) => {
        if (!user) {
            alert("Bạn cần đăng nhập để thích bình luận.");
            return;
        }
        console.log("id ngupwif dùng :" + user.id);
        
        const updatedComments = comments.map((cmt) => {
            if (cmt.id !== commentId) return cmt;

            const hasLiked = Array.isArray(cmt.likes) && cmt.likes.includes(user.id);
            const newLikes = hasLiked
                ? cmt.likes.filter((id) => id !== user.id)
                : [...(cmt.likes || []), user.id];

            return { ...cmt, likes: newLikes };
        });

        const updatedComment = updatedComments.find((c) => c.id === commentId);
        setComments(updatedComments);

        try {
            const res = await axios.patch(`http://localhost:9999/comments/${commentId}`, {
                likes: updatedComment.likes,
            });
            console.log(`✅ Đã cập nhật like cho comment ${commentId}:`, res.data.likes);
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật like:", err);
        }
    };

    const handleAddComment = async () => {
        if (!user) {
            alert("Bạn phải đăng nhập để bình luận.");
            return;
        }

        if (commentInput.trim() === "") return;

        const newComment = {
            id: Date.now().toString(), 
            storyId,
            chapterId,
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            content: commentInput.trim(),
            createdAt: new Date().toISOString(),
            likes: []
        };

        try {
            const res = await axios.post("http://localhost:9999/comments", newComment);
            setComments([res.data, ...comments]);
            setCommentInput("");
        } catch (err) {
            console.error("❌ Lỗi gửi bình luận:", err);
        }
    };

    return (
        <div className="mt-5">
            <Form.Group className="mb-3">
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập bình luận..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                />
            </Form.Group>
            <Button onClick={handleAddComment}>Gửi bình luận</Button>

            <div className="mt-4">
                {comments.map((cmt) => (
                    <Card key={cmt.id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex align-items-start">
                                <img
                                    src={cmt.avatar}
                                    alt={cmt.username}
                                    width={40}
                                    height={40}
                                    className="rounded-circle me-2"
                                />
                                <div>
                                    <strong>{cmt.username}</strong>
                                    <div>{cmt.content}</div>
                                    <small className="text-muted">
                                        {new Date(cmt.createdAt).toLocaleString()}
                                    </small>
                                    <div>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => handleLike(cmt.id)} 
                                            style={{textDecoration:'none'}}
                                        >
                                            👍 {cmt.likes?.length || 0}
                                        </Button>
                                    </div>

                                    {cmt.replies?.length > 0 && (
                                        <div className="mt-2 ps-3 border-start">
                                            {cmt.replies.map((rep) => (
                                                <div key={rep.id} className="mb-2">
                                                    <div className="d-flex align-items-start">
                                                        <img
                                                            src={rep.avatar}
                                                            alt={rep.username}
                                                            width={30}
                                                            height={30}
                                                            className="rounded-circle me-2"
                                                        />
                                                        <div>
                                                            <strong>{rep.username}</strong>
                                                            <div>{rep.content}</div>
                                                            <small className="text-muted">
                                                                {new Date(rep.createdAt).toLocaleString()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}
