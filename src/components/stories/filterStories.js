import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Image, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const FilterStories = () => {
  const [tags, setTags] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); // now an array
  const [searchValue, setSearchValue] = useState('');
  const [authors, setAuthors] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:9999/tags');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:9999/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:9999/users');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };
    fetchTags();
    fetchStories();
    fetchAuthors();
  }, []);

  const handleTagChange = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearSearch = () => {
    setSearchValue('');
    window.history.replaceState({}, document.title, window.location.pathname);
  };


  const filteredStories = stories.filter(story => {
   
    const tagMatch = selectedTags.length === 0 || (
      story.tags && selectedTags.every(tagId => story.tags.includes(Number(tagId)))
    );
    const searchMatch = !searchValue || (story.title && story.title.toLowerCase().includes(searchValue.toLowerCase()));
    return tagMatch && searchMatch;
  });

  const renderTags = () => {
    return (
        <Card className="mb-3">
            <Card.Body>
              <h4>Bộ lọc</h4>
              <Form>
                {tags.map(tag => (
                  <Form.Check
                    key={tag.id}
                    type="checkbox"
                    label={tag.name}
                    value={tag.id}
                    checked={selectedTags.includes(tag.id.toString())}
                    onChange={() => handleTagChange(tag.id.toString())}
                  />
                ))}
              </Form>
            </Card.Body>
          </Card>
    )
  }

  const renderStories = () => {
    return(
        <Card>
            <Card.Body>
              <h4>Danh sách truyện</h4>
              {searchValue && (
                <div className="mb-3 d-flex align-items-center">
                  <span className="me-2">Tìm kiếm cho : <b>"{searchValue}"</b></span>
                  <Button variant="link" className="p-0 ms-2 text-danger" onClick={handleClearSearch}>
                    Hủy tìm kiếm theo tên
                  </Button>
                </div>
              )}
              {filteredStories.length === 0 ? (
                <div>Không có truyện nào phù hợp.</div>
              ) : (
                filteredStories.map(story => (
                  <Card key={story.id} className="mb-3">
                    <Card.Body className="d-flex align-items-center">
                      <Image
                        src={story.coverImage || "/book-icon.png"} 
                        onError={(e) => {
                          e.target.src = "/book-icon.png";
                          e.target.onerror = null; // Prevent infinite loop
                        }}
                        rounded
                        style={{ width: 80, height: 100, objectFit: 'cover', marginRight: 16 }}
                      />
                      <div>
                        <h5 className="text-primary" style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => navigate(`/storypage/${story.id}`)}>{story.title}</h5>
                        <div className="text-muted mb-2">{story.description}</div>
                        <div><b>Thể loại:</b> {story.tags && story.tags.length > 0
                          ? story.tags.map(tagId => {
                              const tag = tags.find(t => t.id === tagId);
                              return tag ? tag.name : '';
                            }).filter(Boolean).join(', ')
                          : 'Không có'}</div>
                        <div className="mb-1">
                          <span className="me-3"><b>Rating:</b> {story.rating ?? 'N/A'}</span>
                          <span><b>Tác giả:</b> {authors.find(a => a.id === story.authorId)?.username}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
    )
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          {renderTags()}
        </Col>
        <Col md={8}>
        {renderStories()}          
        </Col>
      </Row>
    </Container>
  );
};
export default FilterStories;