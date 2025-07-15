
import Header from './header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Homepage from "./components/Homepage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import {Navigate} from "react"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage></Homepage>} />
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
      </Routes>
    </Router>
  );
}
export default App;

