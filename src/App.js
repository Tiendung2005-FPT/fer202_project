
import Header from './header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDetail from './users/userDetail';
import FilterStories from './stories/filterStories';
import StoryPage from "./components/storyPage/index"
import ReadStory from "./components/readStorys/index"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Homepage from "./components/Homepage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import {Navigate} from "react"

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        <Route path="/" element={<Homepage></Homepage>} />
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

