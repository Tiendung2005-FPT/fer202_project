
import Header from './header';

import UserDetail from './users/userDetail';
import React from 'react';
import FilterStories from './stories/filterStories';
import StoryPage from "./components/storyPage/index"
import ReadStory from "./components/readStorys/index"
import { BrowserRouter, Link, Route, Routes ,Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
    
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
