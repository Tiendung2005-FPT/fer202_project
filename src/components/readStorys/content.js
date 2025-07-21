import { Row, Col } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

export default function Content({ chapter, story , size}) {

  return (
    <Row className={`my-4 fontSize-${size}`} >
      <Col md={{ span: 10, offset: 1 }} xs={12}>
        <Link to={`/storyPage/${story.id}`} className={"story_name"}><h3 className="text-center mb-3">{story.title || "Title chưa có"}</h3></Link>
        <h5 className="text-center mb-4">
          {chapter?.title || "Chương chưa có"}
        </h5>

        <div
          style={{
            whiteSpace: 'pre-wrap',
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
