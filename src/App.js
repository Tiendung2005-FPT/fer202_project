import Header from './header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDetail from './users/userDetail';
import React from 'react';

function Home() {
  return <div>Home Page</div>;
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userDetail/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
