import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserManager() {
    const [acc, setAcc] = useState([])
    const [search, setSearch] = useState('')
    const [selectStatus, setSelectStatus] = useState('')
    const [selectRole, setSelectRole] = useState('')
    const [role, setRole] = useState([])

    useEffect(() => {
        axios.get('http://localhost:9999/users')
            .then(result => setAcc(result.data))
            .catch(err => console.error(err))

        axios.get('http://localhost:9999/users')
            .then(result => {
                const data = result.data
                const roleList = [...new Set(data.map(d => d.role))]
                setRole(roleList)
            })
            .catch(err => console.error(err))
    }, [])

    const searchAcc = acc.filter(a => a.email.toLowerCase().startsWith(search.toLowerCase()) || a.fullname.toLowerCase().startsWith(search.toLowerCase()))

    const filterStatus = selectStatus ? searchAcc.filter(a => a.status === selectStatus) : searchAcc

    const filterRole = selectRole ? filterStatus.filter(a => a.role === selectRole) : filterStatus

    const handleBanUser = (id, status) => {

        const isUnban = status === 'inactive'
        const confirm = window.confirm("Bạn có chắc chắn muốn " + (status === 'active' ? 'mở khóa' : "khóa") + " tài khoản này?")
        if (!confirm) {
            return
        }

        let reasonBan = ''
        if (!isUnban) {
            reasonBan = window.prompt("Nhập lí do khóa tài khoản: ")
            if (!reasonBan || reasonBan.trim() === "") {
                alert("Bạn cần nhập lí do khóa!")
                return
            }

        }

        const newStatus = {
            status: isUnban ? 'active' : 'inactive',
            reasonBan: reasonBan
        }

        axios.patch(`http://localhost:9999/users/${id}`, newStatus)
            .then(result => {
                alert("Cập nhật trạng thái thành công!")
                return axios.get('http://localhost:9999/users');
            })
            .then(result => setAcc(result.data))
            .catch(err => console.error(err))
    }

    return (
        <Row className="dashboard-container">

            <Row className="mb-4">
                <Col className="recent-accounts-header">
                    Danh sách tất cả tài khoản
                </Col>
            </Row>

            <Row className="filters-container">
                <Col xs={3}>
                    <Form>
                        <Form.Group >
                            <Form.Control value={search} onChange={e => setSearch(e.target.value)} placeholder="Nhập email hoặc tên người dùng ..." className="search-input">
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>

                <Col xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Select value={selectStatus} onChange={e => setSelectStatus(e.target.value)} className="filter-select">
                                <option value=''>Trạng thái hoạt động</option>
                                <option value='active'>Hoạt động</option>
                                <option value='inactive'>Không hoạt động</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={3}>
                    <Form>
                        <Form.Group>
                            <Form.Select value={selectRole} onChange={e => setSelectRole(e.target.value)} className="filter-select">
                                <option value=''>Loại tài khoản</option>
                                {
                                    role?.map(r => (
                                        <option value={r}>{r === 'admin' ? 'Admin' : 'Khách'}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>


            <Row>
                <Col>
                    <div className="accounts-table-container">
                        <Table className="accounts-table">
                            <thead>
                                <th>Người dùng</th>
                                <th>Loại tài khoản</th>
                                <th>Ngày đăng ký</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </thead>
                            <tbody>
                                {filterRole?.map(a =>
                                    <tr>
                                        <td>{a.fullname} <br></br>{a.email}</td>
                                        <td>{a.role === 'admin' ? 'Admin' : 'Khách'}</td>
                                        <td>{new Date(a.createdAt).toLocaleTimeString()} {new Date(a.createdAt).toLocaleDateString()}</td>
                                        <td>{a.status === 'active' ? "Hoạt động" : "Không hoạt động"}</td>
                                        <td>
                                            <Link to={`/userDetail/${a.id}`} className="action-link">
                                                <i className="bi bi-eye"></i> Xem
                                            </Link>
                                            {
                                                a.role === 'user' ? (<button
                                                    className={`action-link ban-button ${a.status === 'inactive' ? 'unban-button' : ''}`}
                                                    onClick={() => handleBanUser(a.id, a.status)}
                                                >
                                                    <i className={`bi ${a.status === 'inactive' ? 'bi-unlock' : 'bi-ban'}`}></i>
                                                    {a.status === 'inactive' ? 'Mở khóa' : 'Khóa'}
                                                </button>) : ''
                                            }
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </Table>
                    </div>

                </Col>
            </Row>
        </Row>
    )
}