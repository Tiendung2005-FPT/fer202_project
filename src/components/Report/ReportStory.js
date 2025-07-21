import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


=======
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StoryDescription from "../storyPage/storyDescription";
>>>>>>> origin/main

export default function ReportStory() {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [user, setUser] = useState(null);
    const [report, setReport] = useState("");
    const [reportDetails, setReportDetails] = useState("");
    const [reportList, setReportList] = useState([]);
    const navigate = useNavigate();
<<<<<<< HEAD

    // kiểm tra đăng nhập trước khi báo cáo
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        if(user ==null){
            alert("You need to login to report a story");
            // navigate(`/storypage/${storyId}`);
            return;
        }  
    },([]));

    const sendReport = () => {
        if (!report || !reportDetails) {
            alert("Please fill in all fields");
            return;
        }

        const newReport = {
            reportType: "story",
            reportedUserId: null,
            storyId: storyId,
            userId: user.id,
            report: report,
            reportDetails: reportDetails,
        };


        // Gửi báo cáo đến server
        fetch("http://localhost:9999/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newReport),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Report submitted:", data);
                setReportList([...reportList, data]);
                setReport("");
                setReportDetails("");
                alert("Report submitted successfully");
            })
            .catch((error) => {
                console.error("Error submitting report:", error);
                alert("Failed to submit report");
            });
    };
    

    return (
        <>
            <h1>Danh sách báo cáo bạn đã gửi về truyện</h1>







            <h2> Báo Cáo truyện </h2>
            <Form>
                <Form.Group>
                    <Form.Label> Lý Do báo cáo </Form.Label>
                    <Form.Control
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        placeholder="Nhập vào lý do bạn muốn báo cáo, tại chapter nào"
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label> Báo cáo cụ thể </Form.Label>
                    <Form.Control
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        placeholder="Nhập vào nội dung cụ thể của báo cáo, chứa nội dung gì nhảy cảm, bạn cảm thấy không phù hợp"
                    >
                    </Form.Control>
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={() => {

                        console.log("Report submitted:", { report, reportDetails });
                    }}>
                    Submit Report
                </Button>
            </Form>
        </>
=======
    const [showForm, setShowForm] = useState(false);
    const [reportSubmittedFlag, setReportSubmittedFlag] = useState(0); // Dùng counter để đảm bảo luôn kích hoạt

    const [showFullDesc, setShowFullDesc] = useState(false);
    const toggleDesc = () => setShowFullDesc(!showFullDesc);

    // kiểm tra đăng nhập trước khi báo cáo
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userAccount"));
        setUser(storedUser); // Cập nhật state user (sẽ có hiệu lực ở lần render tiếp theo)
        if (storedUser === null) { // HOẶC !storedUser
            alert("You need to login to report a story");
            navigate(`/login`);
        }
    }, ([]));

    // Lấy thông tin truyện từ server để hiện thị thông tin cơ bản
    useEffect(() => {
        axios.get(`http://localhost:9999/stories/${storyId}`)
            .then((response) => {
                setStory(response.data);
            }).catch((error) => {
                console.error("Error fetching story:", error);
                alert("Failed to fetch story details");
            })
    }, ([storyId]));

    // --- EFFECT 3: Fetch Report List (chạy khi story VÀ user thay đổi) ---
    useEffect(() => {
        if (story && user?.id) {
            const reportedStoryId = story.id;
            const reporterUserId = user.id;
            let apiUrl = "";
            if (user.role === "admin") {
                apiUrl = `http://localhost:9999/reports?reportedStoryId=${reportedStoryId}&&reportType=story`;
            } else {
                apiUrl = `http://localhost:9999/reports?reportedStoryId=${reportedStoryId}&reporterUserId=${reporterUserId}`;
            }
            axios.get(apiUrl)
                .then(response => {
                    setReportList(response.data);
                    console.log("Report List fetched:", response.data);
                })
                .catch(err => {
                    console.error("Error fetching report list:", err);
                    alert("Failed to load report list."); // Có thể giữ alert hoặc bỏ đi
                });
        } else if (story && !user) {
            // Có story nhưng chưa có user (có thể user chưa đăng nhập)
            setReportList([]); // Đảm bảo danh sách báo cáo trống nếu không có người dùng
        }
    }, [story, user, reportSubmittedFlag]);

    const sendReport = () => {
        if (user === null) {
            alert("Bạn cần đăng nhập để gửi báo cáo.");
            navigate('/login');
            return; // Dừng hàm nếu user là null
        }
        if (!report || !reportDetails) {
            alert("Please fill in all fields");
            return;
        } else {
            const newReport = {
                reportType: "story",
                reportedUserId: null,
                reportedStoryId: storyId,
                reporterUserId: user.id,
                reason: report,
                details: reportDetails,
                status: "Chờ xử lý",
                createdAt: new Date().toISOString(),
                resolvedBy: null,
                resolvedAt: null
            };
            axios.post("http://localhost:9999/reports", newReport)
                .then(result => {
                    if (result.data) {
                        alert("Đã gửi báo cáo thành công.");
                        setReportSubmittedFlag(prev => prev + 1); // Tăng counter để kích hoạt useEffect
                    }
                    else {
                        alert("Có vẫn đề xảy ra trong quá trình gửi báo cáo. Xin vui lòng thử lại.")
                    }
                })
        }
    };

    const renderForm = () => {
        return (
            <>
                <Form>
                    <Form.Group>
                        <Form.Label> Lý Do báo cáo </Form.Label>
                        <Form.Control
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                            placeholder="Nhập vào lý do bạn muốn báo cáo, tại chapter nào"
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label> Báo cáo cụ thể </Form.Label>
                        <Form.Control
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder="Nhập vào nội dung cụ thể của báo cáo, chứa nội dung gì nhảy cảm, bạn cảm thấy không phù hợp"
                        >
                        </Form.Control>
                    </Form.Group>
                    <Button
                        className="me-2"
                        variant="primary"
                        onClick={() => {
                            console.log("Report submitted:", { report, reportDetails });
                            sendReport();
                            setShowForm(false);
                            setReport("");
                            setReportDetails("");
                        }}>
                        Gửi báo cáo
                    </Button>
                    <Button
                        className="me-2"
                        variant="primary"
                        onClick={() => {
                            setShowForm(false);
                            setReport("");
                            setReportDetails("");
                        }}
                    >
                        Hủy gửi form
                    </Button>
                </Form>
            </>
        )
    }

    const reportSolve = (reportId) => {
        if (user?.role !== "admin") {
            alert("Bạn không có quyền giải quyết báo cáo này.");
            return;
        }

        const reportToSolve = reportList.find(r => r.id === reportId);
        if (!reportToSolve) {
            alert("Báo cáo không tồn tại.");
            return;
        }

        const updatedReport = {
            ...reportToSolve,
            status: "resolved",
            resolvedBy: user.id,
            resolvedAt: new Date().toISOString()
        };

        axios.put(`http://localhost:9999/reports/${reportId}`, updatedReport)
            .then(response => {
                if (response.data) {
                    alert("Báo cáo đã được giải quyết thành công.");
                    setReportSubmittedFlag(prev => prev + 1); // Tăng counter để kích hoạt useEffect
                } else {
                    alert("Có vấn đề xảy ra trong quá trình giải quyết báo cáo. Xin vui lòng thử lại.");
                }
            })
            .catch(err => {
                console.error("Error resolving report:", err);
                alert("Failed to resolve report.");
            });
    }

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <h3>Thông tin truyện</h3>
                    <Row>
                        <Col md={3} xs={12} className="text-center mb-3">
                            <img
                                src={story?.coverImage || "/book-icon.png"}
                                alt="Cover"
                                className="img-fluid rounded"
                                style={{ maxHeight: "400px", objectFit: "cover" }}
                            />
                        </Col>
                        <Col md={9} xs={12}>
                            <h3>{story?.title}</h3>
                            <StoryDescription
                                description={story?.description}
                                showFullDesc={showFullDesc}
                                onToggle={toggleDesc}
                            />
                        </Col>
                    </Row>

                    {user?.role === "user" ?
                        showForm ? (
                            renderForm()
                        ) : <Button onClick={() => setShowForm(true)}>Thêm báo cáo </Button>
                        : <></>}

                    {user?.role === "user" ? (
                        <>
                            <h4>Danh sách báo cáo bạn đã gửi</h4>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Lý do</th>
                                        <th>Chi tiết</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày gửi</th>
                                        <th>Ngày được xử lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportList.map((report, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{report.reason}</td>
                                            <td>{report.details}</td>
                                            <td>{report.status}</td>
                                            <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                            <td>{report.resolvedAt == null ? "Chưa có dữ liệu" : new Date(report.resolvedAt).toLocaleDateString()}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : user?.role === "admin" ? (
                        <>
                            <h4>Danh sách các báo cáo</h4>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Lý do</th>
                                        <th>Chi tiết</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày gửi</th>
                                        <th>Hành Động</th>
                                        <th>Được giải quyết vào lúc</th>
                                        <th>Giải quyết bởi user id:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportList.map((report, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{report.reason}</td>
                                            <td>{report.details}</td>
                                            <td>{report.status}</td>
                                            <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                            <Button disabled={report.status === "resolved"} onClick={() => reportSolve(report.id)}> Giải quyết báo cáo</Button>
                                            <td>{report.resolvedAt == null ? "Chưa có dữ liệu" : new Date(report.resolvedAt).toLocaleDateString()}</td>
                                            <td>{report.resolvedBy == null ? "Chưa có dữ liệu" : report.resolvedBy}</td>


                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : <></>}


                    {/* To Do: hiển thị danh sách các báo cáo đã gửi (giảm dần theo thời gian) */}
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
>>>>>>> origin/main
    );
}