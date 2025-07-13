import { Col, Container, Row } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

export default function App() {
  return (
    <Container>
      <Row>
        <Col>
          <BrowserRouter>
            <Routes>
              
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/register" element={<Register></Register>}></Route>

            </Routes>
          </BrowserRouter>
        </Col>
      </Row>
    </Container>
  );
}

