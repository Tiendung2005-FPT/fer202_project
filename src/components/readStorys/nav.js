// readStorys/nav.js
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Nav({ storyId, currentChapter, totalChapters }) {
  const navigate = useNavigate();

  const goTo = (chapterNum) => {
    navigate(`/readStory/${storyId}/${chapterNum}`);
  };

  return (
    <ButtonGroup className="d-flex justify-content-between my-3">
      <Button
        variant="outline-primary"
        disabled={currentChapter <= 1}
        onClick={() => goTo(currentChapter - 1)}
      >
        ◀ Chương trước
      </Button>

      <Button
        variant="secondary"
        onClick={() => navigate(`/story/${storyId}`)}
      >
        📚 Danh mục
      </Button>

      <Button
        variant="outline-primary"
        disabled={currentChapter >= totalChapters}
        onClick={() => goTo(currentChapter + 1)}
      >
        Chương sau ▶
      </Button>
    </ButtonGroup>
  );
}
