import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChapterWriter from "./components/ChapterWrite/ChapterWriter.js";
import Canvas from "./components/ChapterWrite/Canvas.js";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Canvas />}></Route>
          <Route path="/write-chapter/:sId" element={<ChapterWriter />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
