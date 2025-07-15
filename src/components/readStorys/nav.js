import "./nav.css";
import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  HouseFill,
  GearFill,
  ExclamationDiamondFill,
  BookmarkFill,
  ArrowLeft,
  ArrowRight
} from 'react-bootstrap-icons';
import { useState } from "react";

export default function Nav({ storyId, currentChapterId, chapters, theme, setTheme }) {
  const navigate = useNavigate();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [font, setFont] = useState("Lora");
  const [fontSize, setFontSize] = useState(20);

  const validChapters = chapters
    .filter(ch => !ch.isDraft && ch.order != null)
    .sort((a, b) => a.order - b.order);

  const currentChapter = validChapters.find(ch => String(ch.id) === String(currentChapterId));
  const currentOrder = currentChapter?.order || 1;

  const minOrder = validChapters[0]?.order;
  const maxOrder = validChapters[validChapters.length - 1]?.order;

  const goToOrder = (order) => {
    const target = validChapters.find(ch => ch.order === order);
    if (target) {
      navigate(`/readStory/${storyId}/${target.id}`);
    }
  };

  return (
    <div className="custom-nav-bar">
      <Button variant="link" onClick={() => navigate('/')} className="button-custom-home">
        <HouseFill /> Trang Chủ
      </Button>

      <Button variant="link" onClick={() => setIsShowPopUp(true)} className="button-custom-setting">
        <GearFill /> Tùy chỉnh
      </Button>

      {isShowPopUp && (
        <div className="popup-setting">
          <button className="close-btn" onClick={() => setIsShowPopUp(false)}>✕</button>

          <div className="color-options">
            {[
              { name: "white", code: "#f8f9fa" },
              { name: "green", code: "#d1e7dd" },
              { name: "pink", code: "#fde2e2" },
              { name: "beige", code: "#fef6e4" },
              { name: "purple", code: "#f3e8ff" },
              { name: "black", code: "#000000" }
            ].map((color, idx) => (
              <div
                key={idx}
                className={`color-dot ${theme === color.name ? "selected" : ""} ${color.name}`}
                style={{ backgroundColor: color.code }}
                onClick={() => setTheme(color.name)}
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
        <Button
          variant="light"
          size="sm"
          onClick={() => goToOrder(currentOrder - 1)}
          disabled={currentOrder <= minOrder}
        >
          <ArrowLeft />
        </Button>

        <Dropdown>
          <Dropdown.Toggle size="sm" variant="outline-secondary">
            Chương {currentOrder}
          </Dropdown.Toggle>
          <Dropdown.Menu className="tongle-dropdown-custom">
            {validChapters.map(ch => (
              <Dropdown.Item
                key={ch.id}
                active={ch.id === currentChapterId}
                onClick={() => navigate(`/readStory/${storyId}/${ch.id}`)}
              >
                {ch.title || `Chương ${ch.order}`}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Button
          variant="dark"
          size="sm"
          onClick={() => goToOrder(currentOrder + 1)}
          disabled={currentOrder >= maxOrder}
        >
          <ArrowRight />
        </Button>
      </div>

      <Button variant="link" className="btn-custom-sendError">
        <ExclamationDiamondFill /> Báo Lỗi
      </Button>

      <Button variant="link" className="btn-custom-bookmarks">
        <BookmarkFill /> Theo Dõi
      </Button>
    </div>
  );
}
