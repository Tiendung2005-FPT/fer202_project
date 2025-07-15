// Test commit for duyanh branch
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const acc = JSON.parse(localStorage.getItem("userAccount"));

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/tags`);
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleProfileClick = () => {
    let userId = localStorage.getItem("userId");
    if (userId) {
      userId = userId.replace(/"/g, "");
      navigate(`/userDetail/${userId}`);
      console.log(userId);
    } else {
      alert("User ID not found in localStorage");
    }
  };

  const handleToFilterPage = () => {
    navigate("/filterStories");
  };

  const handleIconClick = () => {
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/filterStories?search=${encodeURIComponent(searchValue)}`);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userAccount");
    alert("Đăng xuất thành công!");
    navigate("/");
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar
        expand="lg"
        variant="dark"
        style={{
          background: "#1976f6",
          borderBottom: "none",
          paddingBottom: 0,
        }}
      >
        <Container
          fluid
          className="d-flex align-items-center"
          style={{ flexWrap: "nowrap", height: "50px" }}
        >
          {/* Logo */}
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            className="me-3 d-flex align-items-center flex-shrink-0"
          >
            <span
              style={{ fontWeight: "bold", fontSize: "2rem", color: "#fff" }}
            >
              StoryForge
            </span>
          </Navbar.Brand>

          {/* Search */}
          <div
            className="d-flex flex-grow-1 justify-content-center"
            style={{ maxWidth: "600px" }}
          >
            <Form
              className="d-flex w-100"
              style={{ maxWidth: "500px" }}
              onSubmit={handleSearchSubmit}
            >
              <div className="input-group" style={{ height: "44px" }}>
                <Form.Control
                  type="search"
                  placeholder="Tìm truyện..."
                  aria-label="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{
                    height: "100%",
                    fontSize: "14px",
                  }}
                />
                <Button
                  variant="outline-light"
                  type="submit"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#ced4da",
                    color: "#495057",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "45px",
                  }}
                >
                  <i className="bi bi-search"></i>
                </Button>
              </div>
            </Form>
          </div>

          {/* Icons and Account */}
          <Nav className="d-flex flex-row align-items-center ms-2 flex-shrink-0">
            <Nav.Item className="mx-2">
              <i
                onClick={handleIconClick}
                className="bi bi-lightbulb"
                style={{
                  color: "orange",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              ></i>
            </Nav.Item>
            <Dropdown align="end" className="mx-2">
              <Dropdown.Toggle
                variant="link"
                id="accountDropdown"
                style={{
                  color: "#cfd8dc",
                  textDecoration: "none",
                  boxShadow: "none",
                  fontSize: "14px",
                }}
              >
                <i className="bi bi-person"></i> {acc?.fullname || "Guest"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {acc ? (
                  <>
                    <Dropdown.Item onClick={handleProfileClick}>
                      Cá Nhân
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      Đăng xuất
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item href="login">Đăng nhập</Dropdown.Item>
                    <Dropdown.Item href="register">Đăng ký</Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
      {/* Navigation Tabs Bar using react-bootstrap Nav */}
      <div
        style={{
          background: "#f8f9fa",
          borderTop: "1px solid #1976f6",
          borderBottom: "2px solid #1976f6",
          width: "100%",
        }}
      >
        <Nav
          variant="tabs"
          className="justify-content-center"
          defaultActiveKey="#home"
        >
          <Nav.Item>
            <Nav.Link eventKey="#home">
              <i className="bi bi-house-door"></i>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>HOT</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>THEO DÕI</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>LỊCH SỬ</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link title="THỂ LOẠI" onClick={handleToFilterPage}>
              THỂ LOẠI
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
}

export default Header;
