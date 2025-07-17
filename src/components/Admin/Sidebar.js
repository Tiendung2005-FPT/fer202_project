import { Col, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <Row>
            <Col>
                <h5 className="mb-4">Admin Menu</h5>
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/admin/dashboard">📊 Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">👥 Quản lý người dùng</Nav.Link>
                    <Nav.Link as={Link} to="/admin/reports">📝 Báo cáo</Nav.Link>
                </Nav>
            </Col>
        </Row>
    )
}