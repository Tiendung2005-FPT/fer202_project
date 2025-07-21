import axios from "axios";
import { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import './Auth.css'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e) => {
        e.preventDefault();

        axios.get('http://localhost:9999/users')
            .then(result => {
                const user = result.data
                const acc = user.find(a => a.email === email)
                const accInactive = user.find(a => a.status === 'inactive')

                if (accInactive) {
                    alert('Tài khoản không hoạt động')
                    return
                }

                if (!acc) {
                    alert('Tài khoản Email không tồn tại')
                    return
                }

                const checkPass = bcrypt.compareSync(password, acc.password)

                if (!checkPass) {
                    alert('Mật khẩu sai')
                    return
                }
                localStorage.setItem("userAccount", JSON.stringify(acc))
                navigate('/')
            })
            .catch(err => console.error(err))
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} className="px-4">
                    <div className="auth-container">
                        <div className="text-center mb-4">
                            <h2 className="auth-title">Đăng Nhập Tài Khoản</h2>
                            <p className="auth-subtitle">Tiếp tục khám phá kho truyện không giới hạn</p>
                        </div>

                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-lable">
                                    <i className="bi bi-envelope me-2"></i>Email *
                                </Form.Label>
                                <Form.Control className="auth-input" type="email" placeholder="Nhập email..." value={email} onChange={e => setEmail(e.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">
                                    <i className="bi bi-lock me-2"></i>Mật khẩu *
                                </Form.Label>
                                <Form.Control className="auth-input" type="password" placeholder="Nhập mật khẩu..." value={password} onChange={e => setPassword(e.target.value)} required></Form.Control>
                            </Form.Group>

                            <Row>
                                <Col>
                                    <div className="text-center login-link">
                                        Bạn chưa có tài khoản? <Link to={`/register`} className="login-link-text">Tạo tài khoản</Link>
                                    </div>
                                </Col>

                                <Col>
                                    <div className="text-center login-link">
                                        <Link to={`/forgot-password`} className="login-link-text">Quên mật khẩu?</Link>
                                    </div>
                                </Col>

                            </Row>

                            <Button className="auth-button w-100 mt-2" type="submit">
                                <i className="bi bi-person-plus me-2"></i>Đăng nhập
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}