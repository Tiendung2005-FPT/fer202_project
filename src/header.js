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

  const acc = JSON.parse(localStorage.getItem("userAccount"))

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
      console.log( userId );
      
    } else {
        alert('User ID not found in localStorage');
     
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
    localStorage.removeItem("userAccount")
    alert('Đăng xuất thành công!')
    navigate('/')
  }

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
          className="align-items-start"
          style={{ flexWrap: "nowrap" }}
        >
          {/* Logo */}
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            className="me-3 d-flex align-items-center"
          >
            <span
              style={{ fontWeight: "bold", fontSize: "2rem", color: "#fff" }}
            >
              StoryForge
            </span>
          </Navbar.Brand>
          {/* Search */}
          <Form className="d-flex flex-grow-1 mx-2" style={{ maxWidth: 500 }} onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Tìm truyện..."
              className="me-2"
              aria-label="Search"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <Button variant="light" type="submit">
              <i className="bi bi-search"></i>
            </Button>
          </Form>
          {/* Icons and Account */}
          <Nav className="flex-row align-items-center ms-2">
            <Nav.Item className="mx-2">
              <i onClick={handleIconClick}
                className="bi bi-lightbulb"
                style={{ color: "orange", fontSize: "1.5rem" }}
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
                }}
              >
                <i className="bi bi-person"></i> Tài khoản
              </Dropdown.Toggle>
              <Dropdown.Menu>

                {acc ? (
                  <>
                    < Dropdown.Item onClick={handleProfileClick}>
                      Cá Nhân{acc.fullname}
                    </Dropdown.Item>
                    < Dropdown.Item onClick={handleLogout}>
                      Đăng xuất
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item onClick={()=>navigate("/login")}>Đăng nhập</Dropdown.Item>
                    <Dropdown.Item onClick={()=>navigate("/register")}>Đăng ký</Dropdown.Item>
                  </>
                )}

              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar >
      {/* Navigation Tabs Bar using react-bootstrap Nav */}
      < div
        style={{
          background: "#f8f9fa",
          borderTop: "1px solid #1976f6",
          borderBottom: "2px solid #1976f6",
          width: "100%",
        }
        }
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
            <Nav.Link title="THỂ LOẠI" onClick={handleToFilterPage} >THỂ LOẠI</Nav.Link>
          </Nav.Item>


        </Nav>
      </div>
    </>
  );
}

export default Header;
