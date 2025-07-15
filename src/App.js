
import Header from './header';

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
        <Route path="/userDetail/:id" element={<UserDetail />} />
        <Route path="/filterStories" element={<FilterStories />} />
        <Route path="/storypage/:id" element={<StoryPage />} />
        <Route path="/readStory/:storyId/:chapterId" element={<ReadStory />} />
        <Route path="*" element={<Navigate to="/storypage/2" replace />} />
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

