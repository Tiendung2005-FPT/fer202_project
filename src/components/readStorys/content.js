import { Row, Col } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { useEffect, useState } from "react";
export default function Content({ chapter, storyTilte , fontsize}) {
  


  return (
    <Row className="my-4">
      <Col md={{ span: 10, offset: 1 }} xs={12}>
        <h3 className="text-center mb-3">{storyTilte}</h3>
        <h5 className="text-center mb-4">
          {chapter?.title || "Chương chưa có"}
        </h5>

        <div
          className= {`chapter-content-${fontsize} ql-editor`}
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: '1.15rem',
            lineHeight: '2em',
            textAlign: 'justify'
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              chapter?.content || "<p>Nội dung chương đang cập nhật...</p>"
            )
          }}
        />
      </Col>
    </Row>
  );
}
