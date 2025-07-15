import axios from "axios";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState('')

    const handleReset = (e) => {
        e.preventDefault();

        axios.get('http://localhost:9999/users')
            .then(result => {
                const userList = result.data
                const checkEmail = userList.find(e => e.email === email)
                if(!checkEmail) {
                    alert('Tài khoản Email không tồn tại trong hệ thống')
                    return
                }


            })
            .catch(err => console.error(err))
    }

    return (
        <Container>
            <Row>
                <h3 className="text-center mt-2">Quên mật khẩu</h3>
                <Col>
                    <Form onSubmit={handleReset}>
                        <Form.Group>
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email..." onChange={(e) => setEmail(e.target.value)} required></Form.Control>
                        </Form.Group>

                        <Button className="mt-3" type="submit">Gửi</Button>
                    </Form>
                    Bạn đã có mật khẩu? <Link to={`/login`}>Đăng nhập</Link>
                </Col>
            </Row>
        </Container>
    )
}