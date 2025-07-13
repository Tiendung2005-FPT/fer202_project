import React, { useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import './ChapterWriter.css';

// ✅ UPDATED: A wide variety of fonts for writers
const Font = Quill.import('attributors/class/font');
Font.whitelist = [
  // --- Standard System Fonts ---
  'arial', 'georgia', 'times-new-roman', 'comic-sans', 'palatino', 
  
  // --- Curated Google Fonts ---
  // Serif (for body text)
  'lora', 'merriweather', 'playfair-display', 'garamond',
  // Sans-Serif (for modern look or headings)
  'roboto', 'lato', 'open-sans', 'montserrat', 'oswald',
  // Slab Serif (typewriter-esque)
  'roboto-slab', 'arvo',
  // Handwriting/Script (for special emphasis)
  'dancing-script', 'pacifico', 'caveat',
  // Monospace (for "typed" text, code, etc.)
  'inconsolata'
];
Quill.register(Font, true);

export default function ChapterWriter() {
  const [value, setValue] = useState('');
  const [isVip, setIsVip] = useState(true); // Set to true for easy testing

  useEffect(() => {
    // Your user fetching logic remains the same
    axios.get("http://localhost:9999/users?id=1")
      .then(res => {
        const user = Array.isArray(res.data) ? res.data[0] : res.data;
        const now = new Date();
        const expiry = new Date(user.vipExpiry);
        setIsVip(user.isVIP && expiry > now);
        localStorage.setItem("account", JSON.stringify(user));
      })
      .catch(err => console.error(err));
  }, []);

  // Toolbars remain unchanged from the previous step
  const basicModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ],
  };

  const vipModules = {
    toolbar: [
      [{ 'font': Font.whitelist }, { 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="chapter-writer-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={isVip ? vipModules : basicModules}
        placeholder="The story begins..."
      />
    </div>
  );
}