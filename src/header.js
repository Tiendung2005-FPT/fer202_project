// Test commit for duyanh branch
import React from 'react';
import { Navbar, Nav, Container, Dropdown, Form, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
   
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate(`/userDetail/${userId}`);
    } else {
    //   alert('User ID not found in localStorage');
      navigate(`/userDetail/1`);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar expand="lg" variant="dark" style={{background: '#1976f6', borderBottom: 'none', paddingBottom: 0}}>
        <Container fluid className="align-items-start" style={{flexWrap: 'nowrap'}}>
          {/* Logo */}
          <Navbar.Brand onClick={() => navigate('/')} style={{cursor: 'pointer'}} className="me-3 d-flex align-items-center">
            <span style={{fontWeight: 'bold', fontSize: '2rem', color: '#fff'}}>Ten DU AN</span>
          </Navbar.Brand>
          {/* Search */}
          <Form className="d-flex flex-grow-1 mx-2" style={{maxWidth: 500}}>
            <Form.Control type="search" placeholder="Tìm truyện..." className="me-2" aria-label="Search" />
            <Button variant="light" type="submit"><i className="bi bi-search"></i></Button>
          </Form>
          {/* Icons and Account */}
          <Nav className="flex-row align-items-center ms-2">
            <Nav.Item className="mx-2">
              <i className="bi bi-lightbulb" style={{color: 'orange', fontSize: '1.5rem'}}></i>
            </Nav.Item>
            <Dropdown align="end" className="mx-2">
              <Dropdown.Toggle variant="link" id="accountDropdown" style={{color: '#cfd8dc', textDecoration: 'none', boxShadow: 'none'}}>
                <i className="bi bi-person"></i> Tài khoản
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleProfileClick}>Cá Nhân </Dropdown.Item>
                <Dropdown.Item href="#">Đăng nhập</Dropdown.Item>
                <Dropdown.Item href="#">Đăng ký</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
      {/* Navigation Tabs Bar using react-bootstrap Nav */}
      <div style={{background: '#f8f9fa', borderTop: '1px solid #1976f6', borderBottom: '2px solid #1976f6', width: '100%'}}>
        <Nav variant="tabs" className="justify-content-center" defaultActiveKey="#home">
          <Nav.Item>
            <Nav.Link href="#home" eventKey="#home"><i className="bi bi-house-door"></i></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#hot">HOT</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#follow">THEO DÕI</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#history">LỊCH SỬ</Nav.Link>
          </Nav.Item>
          <NavDropdown title="THỂ LOẠI" id="genre-dropdown">
            <NavDropdown.Item href="#action">Action</NavDropdown.Item>
            <NavDropdown.Item href="#romance">Romance</NavDropdown.Item>
          </NavDropdown>
          <Nav.Item>
            <Nav.Link href="#find">TÌM TRUYỆN</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
}

export default Header;
