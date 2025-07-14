import "./nav.css";
import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import {
  HouseFill,
  GearFill,
  ExclamationDiamondFill,
  BookmarkFill,
  ArrowLeft,
  ArrowRight
} from 'react-bootstrap-icons';

export default function Nav({ storyId, currentChapter, totalChapters, theme, setTheme }) {
  const navigate = useNavigate();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [font, setFont] = useState("Lora");
  const [fontSize, setFontSize] = useState(20);
  const [themeColor, setThemeColor] = useState("#ffffff");
  const goTo = (chapterNum) => {
    navigate(`/readStory/${storyId}/${chapterNum}`);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="custom-nav-bar">
      <Button variant="link" onClick={() => navigate('/')} className="button-custom-home">
        <HouseFill />
        Trang Chủ
      </Button>
      <Button variant="link" onClick={() => setIsShowPopUp(true)} className="button-custom-setting">
        <GearFill /> Tùy chỉnh
      </Button>
      {isShowPopUp && (
        <div className="popup-setting">
          <button className="close-btn" onClick={() => setIsShowPopUp(false)}>✕</button>
          <div className="color-options">
            {["#f8f9fa", "#d1e7dd", "#fde2e2", "#fef6e4", "#f3e8ff", "#000000"].map((color, idx) => (
              <div
                key={idx}
                className={`color-dot ${themeColor === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setThemeColor(color)}
              ></div>
            ))}
          </div>

          <div className="setting-row">
            <label>Font:</label>
            <select value={font} onChange={(e) => setFont(e.target.value)}>
              <option value="Lora">Lora</option>
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
            </select>
          </div>

          <div className="setting-row">
            <label>Size:</label>
            <div className="size-controls">
              <button onClick={() => setFontSize((prev) => Math.max(10, prev - 1))}>−</button>
              <span>{fontSize}</span>
              <button onClick={() => setFontSize((prev) => Math.min(40, prev + 1))}>＋</button>
            </div>
          </div>
        </div>
      )}
      <div className="nav-custom">
        <Button variant="light" size="sm" onClick={() => goTo(currentChapter - 1)} disabled={currentChapter <= 1}>
          <ArrowLeft />
        </Button>

        <Dropdown>
          <Dropdown.Toggle size="sm" variant="outline-secondary">
            Chapter {currentChapter}
          </Dropdown.Toggle>
          <Dropdown.Menu className="tongle-dropdown-custom">
            {[...Array(totalChapters)].map((_, idx) => (
              <Dropdown.Item
                key={idx + 1}
                active={idx + 1 === currentChapter}
                onClick={() => goTo(idx + 1)}
              >
                Chapter {idx + 1}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="dark" size="sm" onClick={() => goTo(currentChapter + 1)} disabled={currentChapter >= totalChapters}>
          <ArrowRight />
        </Button>
      </div>

      <Button variant="link" className="btn-custom-sendError">
        <ExclamationDiamondFill />
        Báo Lỗi
      </Button>

      <Button variant="link" className="btn-custom-bookmarks">
        <BookmarkFill />
        Theo Dõi
      </Button>
    </div>
  );
}
