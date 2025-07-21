import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Image, Button, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function UserReportDetail() {
    const { uId } = useParams();
    const [reportedUser, setReportedUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [reason, setReason] = useState('');
    const [filter, setFilter] = useState("review");
    const user = JSON.parse(localStorage.getItem("userAccount"));

    useEffect(() => {
        axios
            .get(`http://localhost:9999/users/${uId}`)
            .then(res => setReportedUser(res.data))
            .catch(err => console.error(err));

        axios
            .get(`http://localhost:9999/reports/?reportedUserId=${uId}&status=${filter}`)
            .then(res => setReports(res.data))
            .catch(err => console.error(err));
    }, [uId, filter]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            alert("Vui lòng nhập lý do hủy kích hoạt.");
            return;
        }

        try {
            const updatePromises = reports.map(report =>
                axios.patch(`http://localhost:9999/reports/${report.id}`, {
                    status: "resolved",
                    resolvedBy: user.id,
                    resolvedAt: new Date(),
                    status: "inactive",
                    reasonBan: reason
                })
            );

            await Promise.all(updatePromises);

            alert("Đã hủy kích hoạt tài khoản người dùng.");

            axios.get(`http://localhost:9999/reports/?reportedUserId=${uId}&status=${filter}`)
                .then(res => setReports(res.data));
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi cập nhật báo cáo.");
        }
    };

    return (
        <Container className="mt-4">
            <h3>Thông tin người dùng</h3>
            {reportedUser && (
                <div className="d-flex align-items-center mb-4">
                    {reportedUser.avatar && (
                        <Image
                            src={reportedUser.avatar}
                            roundedCircle
                            width={64}
                            height={64}
                            className="me-3"
                        />
                    )}
                    <div>
                        <p><strong>Họ tên:</strong> {reportedUser.fullname}</p>
                        <p><strong>Username:</strong> {reportedUser.username}</p>
                        <p><strong>Email:</strong> {reportedUser.email}</p>
                        <p><strong>Số điện thoại:</strong> {reportedUser.phone}</p>
                        <p><strong>Địa chỉ:</strong> {reportedUser.address}</p>
                        <p><strong>Bio:</strong> {reportedUser.bio}</p>
                        <p><strong>Ngày tạo tài khoản:</strong> {new Date(reportedUser.createdAt).toLocaleDateString("vi-VN")}</p>
                        <p><strong>Đăng nhập gần nhất:</strong> {new Date(reportedUser.lastLogin).toLocaleString("vi-VN")}</p>
                    </div>
                </div>
            )}

            <h3>Hủy kích hoạt tài khoản người dùng</h3>
            <Form className="mb-4">
                <Form.Group className="mb-2">
                    <Form.Label>Lý do</Form.Label>
                    <Form.Control
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Nhập lý do hủy kích hoạt..."
                    />
                </Form.Group>
                <Button variant="danger" onClick={handleSubmit}>
                    Hủy kích hoạt
                </Button>
            </Form>

            <Row className="align-items-center mb-3">
                <Col><h3 className="mb-0">Danh sách báo cáo</h3></Col>
                <Col xs="auto">
                    <Form.Select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-auto"
                    >
                        <option value="review">Cần xử lý</option>
                        <option value="resolved">Đã xử lý</option>
                        <option value="">Tất cả</option>
                    </Form.Select>
                </Col>
            </Row>

            {reports.length === 0 ? (
                <p>Không có báo cáo nào cho người dùng này.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Người báo cáo</th>
                            <th>Lý do</th>
                            <th>Chi tiết</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Người xử lý</th>
                            <th>Ngày xử lý</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((r, idx) => (
                            <tr key={r.id}>
                                <td>{idx + 1}</td>
                                <td>{r.reporterUserId}</td>
                                <td>{r.reason}</td>
                                <td>{r.details}</td>
                                <td>{r.status}</td>
                                <td>{new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                                <td>{r.resolvedBy ?? "—"}</td>
                                <td>
                                    {r.resolvedAt
                                        ? new Date(r.resolvedAt).toLocaleString("vi-VN")
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
