import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill-new/dist/quill.snow.css';

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
import MembershipPurchase from './components/Membership/MembershipPurchase.js';
import ReportUser from './components/Report/ReportUser.js';
import ReportsList from './components/Admin/ReportsList.js';
import AdminLayout from './components/Admin/AdminLayout.js';
import Dashboard from './components/Admin/Dashboard.js';
import UserManager from './components/Admin/UserManager.js';
import UserReportDetail from './components/Admin/UserReportDetail.js';

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/membership-purchase" element={<MembershipPurchase />} />
        <Route path="/report-user/:uId" element={<ReportUser />} />
        <Route path="/reports-list" element={<ReportsList />} />
        <Route path="/user-report-detail/:uId" element={<UserReportDetail />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManager />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
