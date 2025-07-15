import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    return (
        <Container>
            <Row>
                <h3>Quên mật khẩu</h3>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email..." required></Form.Control>
                        </Form.Group>

                        <Button className="mt-3" type="submit">Gửi</Button>
                    </Form>
                    Bạn đã có mật khẩu? <Link to={`/login`}>Đăng nhập</Link>
                </Col>
            </Row>
        </Container>
    )
}