import StoryPage from "./components/storyPage/index"
import { BrowserRouter, Link, Route, Routes ,Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<StoryPage />} /> */}
              {/* <Route path="/home" element={<Login />} /> */}
              <Route path="/storypage/:id" element={<StoryPage />} />
              <Route path="*" element={<Navigate to="/storypage/2" replace />} />
            </Routes>
          </BrowserRouter>
  )
}
export default App;
