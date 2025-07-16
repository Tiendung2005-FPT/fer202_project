import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import './ChapterWriter.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCpu } from 'react-icons/fi';
import AIChat from './AIChat';
import { Button } from 'react-bootstrap';

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

export default function ChapterEdit() {
  const [content, setContent] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [chapter, setChapter] = useState(null);
  const quillRef = useRef();
  const { sId, cId } = useParams();
  const navigate = useNavigate();

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

  const isWithin24Hours = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInHours = (now - createdDate) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const hasTitle = title.trim().length > 0;
      const hasContent = quillRef.current?.getEditor().getText().trim().length > 0;

      if (hasTitle || hasContent) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userAccount"));
    if (!user) {
      navigate(`/storypage/${sId}`);
      return;
    }
    axios.get(`http://localhost:9999/stories/?authorId=${user.id}`)
      .then(result => {
        const storyIds = result.data.map(story => story.id);
        if (!storyIds.includes(String(sId))) {
          navigate(`/storypage/${sId}`);
          return;
        }
      })

    axios.get(`http://localhost:9999/stories/${sId}`)
      .then(result => setStory(result.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:9999/chapters/${cId}`)
      .then(result => {
        const data = result.data;
        if (!data.isDraft && !isWithin24Hours(data.createdAt)) {
          navigate(`/storypage/${sId}`);
        }
        setChapter(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(err => console.error(err));

  }, [sId]);

  const handleDraft = (e) => {
    e.preventDefault();
    const chapter = {
      title, content, updatedAt: new Date()
    };

    axios.patch(`http://localhost:9999/chapters/${cId}`, chapter)
      .then(result => {
        if (result.data) alert("Đã lưu bản nháp thành công!");
        else alert("Đã xảy ra lỗi trong quá trình lưu.");
      })
      .catch(err => console.error(err));
  };

  const handleEditChapter = (e) => {
    e.preventDefault();
    if (!title.trim() || !quillRef.current.getEditor().getText().trim()) {
      alert("Tên và nội dung không được trống.");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn đăng chương này không?")) return;

    const chapter = {
      title, content, createdAt: new Date(), updatedAt: new Date(), isDraft: false
    };

    axios.patch(`http://localhost:9999/chapters/${cId}`, chapter)
      .then(result => {
        if (result.data) {
          alert(`Đã đăng chapter ${cId} thành công!`);
          navigate(`/storypage/${sId}`);
        } else {
          alert("Đã xảy ra lỗi trong quá trình đăng.");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="chapter-editor-page">
      <header className="page-header">
        <div className="actions-section">
          <button className="btn btn-primary" onClick={() => navigate(`/storypage/${sId}`)}>
            Quay lại
          </button>

          {chapter?.isDraft ? (
            <>
              <button className="btn btn-secondary" onClick={handleDraft}>
                Lưu bản nháp
              </button>
              <button className="btn btn-primary" onClick={handleEditChapter}>
                Đăng chương
              </button>
            </>
          ) : (
            isWithin24Hours(chapter?.createdAt) && (
              <button className="btn btn-primary" onClick={handleEditChapter}>
                Cập nhật chương
              </button>
            )
          )}
        </div>

        {story && (
          <h2 className="story-title-header">
            {story.title} - Chương {chapter?.order} {chapter?.isDraft && "(Bản nháp)"}
          </h2>
        )}
      </header>


      <div className={`editor-and-ai-container ${showAI ? 'show-ai' : ''}`}>

        <div className="toggle-ai-button-wrapper">
          <button
            className="toggle-ai-button"
            onClick={() => setShowAI(!showAI)}
            title={showAI ? 'Ẩn AI hỗ trợ' : 'Hiện AI hỗ trợ'}
          >
            <FiCpu />
          </button>
        </div>

        <div className="main-editor-content">

          <div className="form-section">
            <label htmlFor="chapter-title" className="form-label">Tên của chương</label>
            <input
              id="chapter-title"
              className="form-control"
              placeholder="Nhập tên chương..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="editor-section">
            <label className="form-label">Nội dung chương</label>
            <div className="chapter-writer-container">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={(value) => setContent(value)}
                modules={isVip ? vipModules : basicModules}
                placeholder="Câu truyện của bạn bắt đầu..."
              />
            </div>
          </div>



        </div>

        {showAI && <AIChat content={quillRef.current?.getEditor().getText() || ''} isVip={isVip} title={title} />}
      </div>
    </div>
  );
}
