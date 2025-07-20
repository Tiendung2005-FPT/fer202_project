import { Col, Nav, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './Sidebar.css'

export default function Sidebar() {
    const navigate = useNavigate()

    const handelLogout = (e) => {
        e.preventDefault()

        localStorage.removeItem("userAccount")
        alert("Đăng xuất thành công")
        navigate('/login')
    }

    return (
        <Row>
            <Col className="sidebar-container">
                <div className="sidebar-header">
                    <h5 className="mt-4">Admin Panel</h5>
                    <p>Quản lý hệ thống StoryForge</p>
                </div>

                <Nav className="flex-column sidebar-nav">
                    <p>ĐIỀU HƯỚNG</p>
                    <Nav.Link as={Link} to="/admin/dashboard">
                        <i className="bi bi-speedometer2"></i>
                        <span>Tổng quan</span>
                    </Nav.Link>
                    <p>QUẢN LÝ TÀI KHOẢN</p>
                    <Nav.Link as={Link} to="/admin/users">
                        <i className="bi bi-people"></i>
                        <span>Tất cả tài khoản</span>
                    </Nav.Link>
                    <p>PHẢN HỒI NGƯỜI DÙNG</p>
                    <Nav.Link as={Link} to="/admin/reports">
                        <i className="bi bi-flag"></i>
                        <span>Báo cáo</span>
                    </Nav.Link>
                    <p>THAO TÁC</p>
                    <Nav.Link as={Link} to="/admin/reports">
                        <i className="bi bi-person-plus"></i>
                        <span>Tạo tài khoản mới</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/reports">
                        <i className="bi bi-key"></i>
                        <span>Đổi mật khẩu</span>
                    </Nav.Link>
                    <Nav.Link onClick={handelLogout} className="logout">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Đăng xuất</span></Nav.Link>
                </Nav>
            </Col>
        </Row>
    )
}