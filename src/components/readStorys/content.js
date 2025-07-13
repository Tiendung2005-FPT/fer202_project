import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Content({ chapter , storyTilte }) {
  return (
    <Row className="my-4">
      <Col md={{ span: 10, offset: 1 }} xs={12} className="bg-light rounded p-4 ">
        <h3 className="text-center mb-3">{storyTilte}</h3>
        <h5 className="text-center text-muted mb-4">
          {chapter?.title || "Chương chưa có"}
          {chapter?.author ? ` - ${chapter.author}` : ""}
        </h5>
        <div
          className="chapter-content"
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: '1.15rem',
            lineHeight: '2em',
            textAlign: 'justify'
          }}
        >
          {chapter?.content || "Nội dung chương đang cập nhật..."}
        </div>
      </Col>
    </Row>
  );
}
