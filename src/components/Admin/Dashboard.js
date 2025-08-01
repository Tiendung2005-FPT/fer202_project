import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Dashboard.css'

export default function Dashboard() {
    const [totalAcc, setTotalAcc] = useState(0)
    const [totalAccActive, setTotalAccActive] = useState(0)
    const [totalAccInactive, setTotalAccInactive] = useState(0)
    const [acc, setAcc] = useState([])

    useEffect(() => {
        axios.get('http://localhost:9999/users')
            .then(result => {
                const userList = result.data
                setTotalAcc(userList.length)

                const userAcive = userList.filter(u => u.status === 'active')
                setTotalAccActive(userAcive.length)

                const userInactive = userList.filter(u => u.status === 'inactive')
                setTotalAccInactive(userInactive.length)
            })
            .catch(err => console.error(err))

<<<<<<< HEAD
        axios.get('http://localhost:9999/users?status=active&_sort=createdAt&_order=desc&_limit=5')
=======
        axios.get('http://localhost:9999/users?_sort=createdAt&_order=desc&_limit=5')
>>>>>>> origin/main
            .then(result => setAcc(result.data))
            .catch(err => console.error(err))
    }, [])

<<<<<<< HEAD
    const handleBanUser = () => {

=======
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
>>>>>>> origin/main
    }

    return (
        <Row className="dashboard-container">
            <Col className="dashboard-title">
                Tổng quan hệ thống
            </Col>

            <Row className="stats-row">
                <Col md={4} className="mb-4">
                    <div className="stat-card primary">
                        <div className="stat-title">
                            <i className="bi bi-people-fill"></i>
                            Tổng số tài khoản
                        </div>
                        <div className="stat-value">{totalAcc}</div>
                    </div>
                </Col>
                <Col md={4} className="mb-4">
                    <div className="stat-card success">
                        <div className="stat-title">
                            <i className="bi bi-person-check-fill"></i>
                            Tài khoản đang hoạt động
                        </div>
                        <div className="stat-value">{totalAccActive}</div>
                    </div>
                </Col>
                <Col md={4} className="mb-4">
                    <div className="stat-card danger">
                        <div className="stat-title">
                            <i className="bi bi-person-x-fill"></i>
                            Tài khoản bị khóa
                        </div>
                        <div className="stat-value">{totalAccInactive}</div>
                    </div>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col className="recent-accounts-header">
                    Danh sách tài khoản gần đây
                    <Link to="/admin/users" className="view-all-link">
                        Xem tất cả <i className="bi bi-arrow-right"></i>
                    </Link>
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
                                {acc?.map(a =>
                                    <tr>
<<<<<<< HEAD
                                        <td>{a.email}</td>
                                        <td>{a.role}</td>
                                        <td>{new Date(a.createdAt).toLocaleTimeString()} {new Date(a.createdAt).toLocaleDateString()}</td>
                                        <td>{a.status === 'active' ? "Hoạt động" : "Không hoạt động"}</td>
                                        <td>
                                            <Link to={`/admin/users/view/${a.id}`} className="action-link">
                                                <i className="bi bi-eye"></i> Xem
                                            </Link>
                                            <button
                                                className={`action-link ban-button ${a.status === 'inactive' ? 'unban-button' : ''}`}
                                                onClick={() => handleBanUser(a.id, a.status)}
                                            >
                                                <i className={`bi ${a.status === 'inactive' ? 'bi-unlock' : 'bi-ban'}`}></i>
                                                {a.status === 'inactive' ? 'Mở khóa' : 'Khóa'}
                                            </button>
=======
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
>>>>>>> origin/main
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