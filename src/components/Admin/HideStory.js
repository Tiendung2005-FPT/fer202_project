import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Badge } from "react-bootstrap";

function HideStory({ isAdmin }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/stories").then((res) => setStories(res.data));
  }, []);

  const updateStatus = async (storyId, newStatus) => {
    await axios.patch(`http://localhost:9999/stories/${storyId}`, { status: newStatus });
    setStories(stories.map(story =>
      story.id === storyId ? { ...story, status: newStatus } : story
    ));
  };

  if (!isAdmin) return <div>Bạn không có quyền truy cập chức năng này.</div>;

  return (
    <div>
      <h2 className="my-4 text-center">Quản lý trạng thái truyện</h2>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Tên truyện</th>
            <th>Tác giả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story.id}>
              <td>{story.title}</td>
              <td>{story.authorId}</td>
              <td>
                <Badge
                  bg={
                    story.status === "hidden"
                      ? "secondary"
                      : story.status === "complete"
                      ? "info"
                      : "success"
                  }
                >
                  {story.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => updateStatus(story.id, "hidden")}
                >
                  Ẩn
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => updateStatus(story.id, "ongoing")}
                >
                  Ongoing
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => updateStatus(story.id, "completed")}
                >
                  Completed
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default HideStory;
