import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import bcrypt from 'bcryptjs'
import './Auth.css'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Cpassword, setCpassword] = useState('')
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        if (!password.trim() || !Cpassword.trim()) {
            alert('Bạn cần điền đủ thông tin')
            return
        }
        if (password !== Cpassword) {
            alert('Mật khẩu không khớp')
            return
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 kí tự")
            return
        }

        const checkPass = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        if (!checkPass.test(password)) {
            alert("Mật khẩu phải có chữ và số")
            return
        }
        // axios.get('http://localhost:9999/users')
        //     .then(result => {
        //         const user = result.data
        //         const maxId = user.length > 0 ? Math.max(...user.map(u => u.id)) : 0
        //         }

        const randomHashPass = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, randomHashPass)

        axios.get('http://localhost:9999/users')
            .then(result => {
                const userList = result.data
                const checkEmail = userList.find(e => e.email === email)

                if (checkEmail) {
                    alert("Email đã tồn tại trong hệ thống")
                    return
                }

                const newUser = {
                    username: null,
                    fullname: null,
                    email: email,
                    password: hashPass,

                    avatar: "https://cdn-icons-png.flaticon.com/512/362/362003.png",
                    role: 'user',
                    vipExpiry: null,
                    createdAt: new Date(),
                    lastLogin: null,
                    bio: null,
                    phone: null,
                    address: null,
                    status: "active",
                    reasonBan: null
                }

                axios.post('http://localhost:9999/users', newUser)
                    .then(result => {
                        if (result.data != null) {
                            const user = result.data
                            localStorage.setItem("userAccount", JSON.stringify(user))
                            localStorage.setItem("userId", JSON.stringify(user.id))
                            console.log(user.id)
                            alert('Register success')
                            navigate('/')
                        } else {
                            alert('Register false')
                        }
                    })
                    .catch(err => console.error(err))

            })
            .catch(err => console.error(err))
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} className="px-4">
                    <div className="auth-container">
                        <div className="text-center mb-4">
                            <h2 className="auth-title">Đăng Ký Tài Khoản</h2>
                            <p className="auth-subtitle">Tham gia cộng đồng đọc truyện ngay hôm nay</p>
                        </div>

                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-lable">
                                    <i className="bi bi-envelope me-2"></i>Email *
                                </Form.Label>
                                <Form.Control className="auth-input" type="email" placeholder="Nhập email..." onChange={e => setEmail(e.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">
                                    <i className="bi bi-lock me-2"></i>Mật khẩu *
                                </Form.Label>
                                <Form.Control className="auth-input" type="password" placeholder="Nhập mật khẩu..." onChange={e => setPassword(e.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">
                                    <i className="bi bi-lock me-2"></i>Xác nhận mật khẩu *
                                </Form.Label>
                                <Form.Control className="auth-input" type="password" placeholder="Nhập lại mật khẩu..." onChange={e => setCpassword(e.target.value)} required></Form.Control>
                            </Form.Group>

                            <Button className="auth-button w-100" type="submit">
                                <i className="bi bi-person-plus me-2"></i>Tạo tài khoản
                            </Button>
                        </Form>

                        <div className="text-center mt-4 login-link">
                            Đã có tài khoản? <Link to={`/login`} className="login-link-text">Đăng nhập</Link>
                        </div>

                    </div>

                </Col>
            </Row>
        </Container>
    )
}