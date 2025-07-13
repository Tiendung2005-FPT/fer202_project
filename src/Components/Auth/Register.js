import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    return(
        <Container>
            <Row>
                <h3 className="text-center mt-2">Tạo tài khoản</h3>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ và tên..."></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email..."></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu..."></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập lại mật khẩu..."></Form.Control>
                        </Form.Group>

                        <Button className="mt-2" type="submit">
                            Tạo tài khoản
                        </Button>
                    </Form>

                    Đã có tài khoản <Link to={`/login`}>Đăng nhập</Link>
                </Col>
            </Row>
        </Container>
    )
}