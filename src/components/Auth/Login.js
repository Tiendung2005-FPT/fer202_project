import axios from "axios";
import { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e) => {
        e.preventDefault();

        axios.get('http://localhost:9999/users')
            .then(result => {
                const user = result.data
                const acc = user.find(a => a.email === email && a.password === password)

                if (acc) {
                    localStorage.setItem("userAccount", JSON.stringify(acc))
                    localStorage.setItem("userId", JSON.stringify(acc.id))
                    navigate('/')
                } else {
                    alert('Tài khoản Email hoặc Mật khẩu không tồn tại')
                }
            })
            .catch(err => console.error(err))
    }

    return (
        <Container>
            <Row>
                <h3 className="text-center mt-2">Đăng nhập</h3>
                <Col>
                    <Form onSubmit={handleLogin}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email..." value={email} onChange={e => setEmail(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu..." value={password} onChange={e => setPassword(e.target.value)} required></Form.Control>
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