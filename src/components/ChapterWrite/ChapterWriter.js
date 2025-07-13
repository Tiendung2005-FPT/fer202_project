import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import './ChapterWriter.css';
import { Button, Container, Form } from 'react-bootstrap';

const Font = Quill.import('attributors/class/font');
Font.whitelist = [
  'arial', 'georgia', 'times-new-roman', 'comic-sans', 'palatino',

  'lora', 'merriweather', 'playfair-display', 'garamond',
  'roboto', 'lato', 'open-sans', 'montserrat', 'oswald',
  'roboto-slab', 'arvo',
  'dancing-script', 'pacifico', 'caveat',
  'inconsolata'
];
Quill.register(Font, true);

export default function ChapterWriter() {
  const [content, setContent] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [name, setName] = useState('');
  const quillRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:9999/users?id=1")
      .then(result => {
        const user = result.data[0]
        const now = new Date();
        const expiry = new Date(user.vipExpiry);
        setIsVip(expiry > now);
        localStorage.setItem("account", JSON.stringify(user));
      })
      .catch(err => console.error(err));
  }, []);

  const basicModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ],
  };

  const vipModules = {
    toolbar: [
      [{ 'font': Font.whitelist }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const handleDraft = (e) => {
    if (name.length == 0 || content.length == 0) {

    }
  }
  const handlePublishChapter = (e) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const rawText = editor.getText();

      if (name.trim().length==0 || rawText.trim().length==0) {
        alert("Tên và nội dung không được chống.");
      }
    }
  }

  return (
    <Container className="chapter-editor-page">
      <div className="form-section">
        <Form>
          <Form.Label>Tên của chương</Form.Label>
          <Form.Group>
            <Form.Control placeholder="Nhập tên chương..." value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
        </Form>
      </div>

      <div className="editor-section">
        <Form.Label>Nội dung chương</Form.Label>
        <div className="chapter-writer-container">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={(content) => {
              console.log("Editor content:", content);
              setContent(content);
            }}
            modules={isVip ? vipModules : basicModules}
            placeholder="Câu truyện của bạn bắt đầu..."
          />
        </div>
      </div>

      <div className="actions-section">
        <Button variant="secondary" onClick={(e) => handleDraft(e)}>Lưu bản nháp</Button>
        <Button variant="primary" onClick={(e) => handlePublishChapter(e)}>Đăng chương</Button>
      </div>
    </Container>
  );
}