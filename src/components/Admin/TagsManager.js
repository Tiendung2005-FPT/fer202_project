import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function TagsManager() {
    const [tags, setTags] = useState([])
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:9999/tags')
            .then(result => setTags(result.data))
            .catch(err => console.error(err))
    }, [])

    const searchTag = tags.filter(t => t.name.toLowerCase().startsWith(search.toLowerCase()))

    const handleAddTag = () => {
        navigate('/admin/add-tag')
    }

    return (
        <Row className="dashboard-container">

            <Row className="mb-4">
                <Col className="recent-accounts-header">
                    Danh sách tất cả thẻ tag
                </Col>
            </Row>

            <Row className="filters-container">
                <Col xs={3}>
                    <Form>
                        <Form.Group >
                            <Form.Control value={search} onChange={e => setSearch(e.target.value)} placeholder="Nhập tên thể loại ..." className="search-input">
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
                <Row>
                    <Col>
                        <Button onClick={handleAddTag}>Thêm thể loại mới</Button>
                    </Col>
                </Row>

            </Row>


            <Row>
                <Col>
                    <div className="accounts-table-container">
                        <Table className="accounts-table">
                            <thead>
                                <th>ID</th>
                                <th>Thẻ tag</th>
                                <th>Số truyện</th>
                            </thead>
                            <tbody>
                                {
                                    searchTag?.map(t =>
                                        <tr>
                                            <td>{t.id}</td>
                                            <td>{t.name}</td>
                                            <td>{t.storyCount}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>

                </Col>
            </Row>
        </Row>
    )
}