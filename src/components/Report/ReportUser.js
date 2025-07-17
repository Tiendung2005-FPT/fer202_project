import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function ReportUser() {
    const { uId } = useParams();
    const navigate = useNavigate();
    const [reportedUser, setReportedUser] = useState(null);
    const [reason, setReason] = useState('');
    const [detail, setDetail] = useState('');
    const [other, setOther] = useState(false);
    const [unable, setUnable] = useState(false);
    const [reports, setReports] = useState(null);
    const user = JSON.parse(localStorage.getItem("userAccount"));

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        axios.get(`http://localhost:9999/users/${uId}`)
            .then(result => {
                const ru = result.data;
                if (ru) {
                    setReportedUser(ru);
                } else {
                    navigate("/");
                }
            })
            .catch(err => console.error(err));

        axios.get(`http://localhost:9999/reports/?reportedUserId=${uId}&reporterUserId=${user.id}&status=review`)
            .then(result => {
                const usersReports = result.data;
                if (usersReports) {
                    setReports(result.data);
                }
            })
            .catch(err => console.error(err)
            )

    }, [uId]);

    useEffect(() => {
        if (reason) {
            const isAlreadyReported = reports.some(report => report.reason === reason);
            setUnable(isAlreadyReported);
        } else {
            setUnable(false);
        }
    }, [reason, reports])

    const handleReasonChange = (e) => {
        const selected = e.target.value;
        if (selected === "other") {
            setOther(true);
            setReason('');
        } else {
            setOther(false);
            setReason(selected);
        }
    };

    const handleSubmit = (e) => {
        if (reason.length === 0 || detail.length === 0) {
            alert("Xin hãy cung cấp đầy đủ lý do và chi tiết.");
        } else {
            const report = {
                "reportType": "user",
                "reportedUserId": uId,
                "reportedStoryId": null,
                "reporterUserId": user?.id,
                "reason": reason,
                "details": detail,
                "status": "review",
                "createdAt": new Date(),
                "resolvedBy": null,
                "resolvedAt": null
            }
            axios.post("http://localhost:9999/reports", report)
                .then(result => {
                    if (result.data) {
                        alert("Đã gửi báo cáo thành công.");
                        navigate("/");
                    }
                    else {
                        alert("Có vẫn đề xảy ra trong quá trình gửi báo cáo. Xin vui lòng thử lại.")
                    }
                })
        }
    }

    if (reportedUser?.role === "admin") {
        return (
            <Container className="py-5">
                <h1 className="text-center text-danger">
                    Bạn không thể báo cáo người dùng này!
                </h1>
            </Container>

        )
    } else {
        return (
            <Container>
                <h1>Báo cáo {reportedUser?.username}</h1>
                <Form>
                    <Form.Label>Lý do</Form.Label>
                    <Form.Select onChange={e => handleReasonChange(e)} value={other ? "other" : reason}>
                        <option value="">-- Chọn lý do --</option>
                        <option value="Ngôn từ xúc phạm">Ngôn từ xúc phạm</option>
                        <option value="Hành vi quấy rối">Hành vi quấy rối</option>
                        <option value="Nội dung không phù hợp">Nội dung không phù hợp</option>
                        <option value="other">Khác</option>
                    </Form.Select>

                    {other && (
                        <>
                            <Form.Label>Nhập lý do khác</Form.Label>
                            <Form.Control
                                placeholder="Mô tả lý do cụ thể..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </>
                    )}

                    <Form.Label>Chi tiết</Form.Label>
                    <Form.Control placeholder="Xin hãy cung cấp chi tiết..." value={detail} onChange={e => setDetail(e.target.value)}></Form.Control>
                </Form>
                {unable && (
                    <p className="text-danger">Bạn đã báo cáo {reportedUser?.username} vì lý do này.</p>
                )}
                {!unable && (
                    <Button onClick={e => handleSubmit(e)}>Gửi báo cáo</Button>
                )}
            </Container>
        );
    }
}
