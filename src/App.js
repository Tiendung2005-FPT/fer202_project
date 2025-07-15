import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './header';
import UserDetail from './users/userDetail';
import FilterStories from './stories/filterStories';
import StoryPage from "./components/storyPage/index";
import ReadStory from "./components/readStorys/index";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ChapterWriter from "./components/ChapterWrite/ChapterWriter.js";
import ChapterEdit from "./components/ChapterWrite/ChapterEdit.js";
import Canvas from "./components/ChapterWrite/Canvas.js";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

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
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

