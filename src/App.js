import { Col, Container, Row } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Homepage from "./components/Homepage";
import ForgotPassword from "./components/Auth/ForgotPassword";

export default function App() {
  return (
    <Container>
      <Row>
        <Col>
          <BrowserRouter>
            <Routes>
              
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/register" element={<Register></Register>}></Route>
              <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>

              <Route path="/homepage" element={<Homepage></Homepage>}></Route>

            </Routes>
          </BrowserRouter>
        </Col>
      </Row>
    </Container>
  );
}

