import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

    return (
        <Container>
            <Row>
                <h3 className="text-center mt-2">Đăng nhập</h3>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email..."></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu..."></Form.Control>
                        </Form.Group>


                        <Row>
                            <Col>
                                Bạn chưa có tài khoản? <Link to={`/register`}>Tạo tài khoản</Link>
                            </Col>

                            <Col>
                                <Link to={`/forgot-password`}>Quên mật khẩu?</Link>
                            </Col>

                        </Row>

                        <Button className="mt-2" type="submit">
                            Đăng nhập
                        </Button>
                    </Form>

                </Col>
            </Row>
        </Container>
    )
}