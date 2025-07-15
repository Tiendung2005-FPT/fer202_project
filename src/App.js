
import Header from './header';
import UserDetail from './users/userDetail';
import React from 'react';
import FilterStories from './stories/filterStories';
import StoryPage from "./components/storyPage/index"
import ReadStory from "./components/readStorys/index"
import ChapterWriter from "./components/ChapterWrite/ChapterWriter.js";
import Canvas from "./components/ChapterWrite/Canvas.js";
import { BrowserRouter, Link, Route, Routes ,Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return <div>Home Page</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
    
        <Route path="/write-chapter/:sId" element={<ChapterWriter />}></Route>
        <Route path="/userDetail/:id" element={<UserDetail />} />
        <Route path="/filterStories" element={<FilterStories />} /> 
        <Route path="/storypage/:id" element={<StoryPage />} />
        <Route path="/readStory/:storyId/:chapterId" element={<ReadStory />} />
        <Route path="*" element={<Navigate to="/storypage/2" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
