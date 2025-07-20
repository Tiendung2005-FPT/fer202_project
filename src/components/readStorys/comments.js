import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

export default function CommentSection() {
  const currentUserId = "1"; // Giả định user đăng nhập

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    {
      id: "1",
      storyId: "1",
      chapterId: "1",
      userId: "1",
      username: "nguoivip",
      avatar: "/logo192.png",
      content: "Chương mở đầu rất hấp dẫn, mong tác giả ra chương mới sớm!",
      createdAt: "2023-03-12T15:30:00Z",
      likes: [2, 3, 4, 5],
      replies: [
        {
          id: "1",
          userId: "2",
          username: "tacgia_no1",
          avatar: "/logo192.png",
          content: "Cảm ơn bạn đã ủng hộ, chương mới sẽ ra vào tuần sau!",
          createdAt: "2023-03-12T16:00:00Z",
          likes: [1, 3],
        },
      ],
    },
    {
      id: "2",
      storyId: "1",
      chapterId: "2",
      userId: "3",
      username: "docgia_truyenma",
      avatar: "/avatars/default.jpg",
      content: "Chất lượng truyện VIP xứng đáng với đồng tiền bỏ ra!",
      createdAt: "2024-01-15T11:45:00Z",
      likes: [1, 2, 5],
      replies: [],
    },
  ]);

  const handleLike = (commentId) => {
    const updated = comments.map((cmt) =>
      cmt.id === commentId
        ? {
            ...cmt,
            likes: cmt.likes.includes(currentUserId)
              ? cmt.likes.filter((id) => id !== currentUserId)
              : [...cmt.likes, currentUserId],
          }
        : cmt
    );
    setComments(updated);
  };

  const handleAddComment = () => {
    if (commentInput.trim() === "") return;
    const newComment = {
      id: (comments.length + 1).toString(),
      storyId: "1",
      chapterId: "1",
      userId: currentUserId,
      username: "current_user",
      avatar: "/avatars/default.jpg",
      content: commentInput,
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
    };
    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  return (
    <div>
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
                    >
                      👍 {cmt.likes.length}
                    </Button>
                  </div>
                  {cmt.replies.length > 0 && (
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
