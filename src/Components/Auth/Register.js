import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [username, setUsername] = useState('')
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Cpassword, setCpassword] = useState('')
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        if (!username.trim() || !fullname.trim() || !username.trim() || !password.trim() || !Cpassword.trim()) {
            alert('Bạn cần điền đủ thông tin')
            return
        }
        if (!username.trim() || !fullname.trim() || !username.trim() || !password.trim() || !Cpassword.trim() || password !== Cpassword) {
            alert('Mật khẩu không khớp')
            return
        }

        const newUser = {
            username: username,
            fullname: fullname,
            email: email,
            password: password,

            avatar: null,
            role: 'user',
            vipExpiry: null,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            bio: null,
            phone: null,
            address: null,
        }


        axios.post('http://localhost:9999/users', newUser)
            .then(result => {
                if (result.data != null) {
                    alert('Register success')
                    navigate('/homepage')
                } else {
                    alert('Register false')
                }
            })
    }

    return (
        <Container>
            <Row>
                <h3 className="text-center mt-2">Tạo tài khoản</h3>
                <Col>
                    <Form onSubmit={handleRegister}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Nhập username..." onChange={e => setUsername(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ và tên..." onChange={e => setFullname(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email..." onChange={e => setEmail(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu..." onChange={e => setPassword(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập lại mật khẩu..." onChange={e => setCpassword(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Button className="mt-2 btn-success" type="submit">
                            Tạo tài khoản
                        </Button>
                    </Form>

                    Đã có tài khoản <Link to={`/login`}>Đăng nhập</Link>
                </Col>
            </Row>
        </Container>
    )
}