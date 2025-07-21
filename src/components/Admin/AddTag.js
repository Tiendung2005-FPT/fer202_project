import { Button, Col, Form, Row } from "react-bootstrap";
import './Dashboard.css'
import { useState } from "react";
import axios from "axios";


export default function AddTag() {
    const [name, setName] = useState('')

    const handleAdd = () => {

        if(!name || name.trim() === '') {
            alert("Bạn cần nhập đủ thông tin")
            return
        }
        const newTag = {
            name: name,
            slug: name.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+|-+$/g, ''),
            storyCount: 0
        }

        axios.post('http://localhost:9999/tags', newTag)
            .then(result => {
                alert('Thêm thẻ tag thành công')
            })
            .catch(err => console.error(err))
    }
    return (
        <Row className="dashboard-container">

            <Col className="dashboard-title">
                Thêm thể loại mới
            </Col>
            <Row>
                <Col>
                    <Form onSubmit={handleAdd}>
                        <Form.Group>
                            <Form.Label>Tên thể loại</Form.Label>
                            <Form.Control type="text" value={name} onChange={e => setName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button type="submit">Thêm</Button>
                    </Form>
                </Col>
            </Row>
        </Row>
    )
}