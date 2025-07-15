import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './header';
import UserDetail from './users/userDetail';
import FilterStories from './stories/filterStories';
import StoryPage from "./components/storyPage/index";
import ReadStory from "./components/readStorys/index";
import ChapterWriter from "./components/ChapterWrite/ChapterWriter.js";
import ChapterEdit from "./components/ChapterWrite/ChapterEdit.js";
import Canvas from "./components/ChapterWrite/Canvas.js";

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/write-chapter/:sId" element={<ChapterWriter />} />
        <Route path="/edit-chapter/:sId/:cId" element={<ChapterEdit />} />
        <Route path="/userDetail/:id" element={<UserDetail />} />
        <Route path="/filterStories" element={<FilterStories />} /> 
        <Route path="/storypage/:id" element={<StoryPage />} />
        <Route path="/readStory/:storyId/:chapterId" element={<ReadStory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

