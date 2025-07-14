import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import './ChapterWriter.css';
import { useParams } from 'react-router-dom';
import { FiCpu } from 'react-icons/fi';
import AIChat from './AIChat';


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
  const [story, setStory] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const quillRef = useRef();
  const { sId } = useParams();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const hasTitle = name.trim().length > 0;
      const hasContent = quillRef.current?.getEditor().getText().trim().length > 0;

      if (hasTitle || hasContent) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [name, content]);

  useEffect(() => {
    axios.get("http://localhost:9999/users?id=1")
      .then(result => {
        const user = result.data[0]
        const now = new Date();
        const expiry = new Date(user.vipExpiry);
        setIsVip(expiry > now);
        localStorage.setItem("account", JSON.stringify(user));
      })
      .catch(err => console.error(err))
    axios.get(`http://localhost:9999/stories?id=${sId}`)
      .then(result => setStory(result.data[0]))
      .catch(err => console.error(err)
      )
  }, [sId]);

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
    e.preventDefault();
    const chapter = { storyId: sId, title: name, content: content, order: null, createdAt: null, updatedAt: null, views: 0, isDraft: true };
    chapter.updatedAt = new Date();

    axios.post("http://localhost:9999/chapters", chapter)
      .then(result => {
        if (result.data != null) {
          alert("Đã lưu bản nháp thành công!");
        }
        else alert("Đã xảy ra lỗi trong quá trình lưu.")
      })
  }

  const handlePublishChapter = (e) => {
    e.preventDefault();
    if (quillRef.current) {
      const text = quillRef.current.getEditor().getText();

      if (!name.trim() || !text.trim()) {
        alert("Tên và nội dung không được trống.");
      } else {
        const chapter = { storyId: sId, title: name, content: content, order: null, createdAt: new Date(), updatedAt: new Date(), views: 0, isDraft: false };

        axios.post("http://localhost:9999/chapters", chapter)
          .then(result => {
            if (result.data != null) {
              alert("Đã đăng chapter thành công!");
            }
            else alert("Đã xảy ra lỗi trong quá trình đăng.")
          })
      }
    }
  }

  return (
    <div className="chapter-editor-page">
      <header className="page-header">
        {story && <h2 className="story-title-header">{story.title}</h2>}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="editor-section">
            <label className="form-label">Nội dung chương</label>
           <div className="chapter-writer-container">
  <ReactQuill
    ref={quillRef}
    theme="snow"
    value={content}
    onChange={(value) => {
      console.log("Content updated:", value);
      setContent(value);
    }}
    modules={isVip ? vipModules : basicModules}
    placeholder="Câu truyện của bạn bắt đầu..."
  />
</div>
          </div>

          <div className="actions-section">
            <button
              className="btn btn-secondary"
              onClick={(e) => handleDraft(e)}
            >
              Lưu bản nháp
            </button>
            <button
              className="btn btn-primary"
              onClick={(e) => handlePublishChapter(e)}
            >
              Đăng chương
            </button>
          </div>
        </div>

        {showAI && <AIChat content={quillRef.current.getEditor().getText()} isVip={isVip}/>}
      </div>
    </div>
  );
}