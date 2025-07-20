import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StoryDescription from "../storyPage/storyDescription";

export default function ReportStory() {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [user, setUser] = useState(null);
    const [report, setReport] = useState("");
    const [reportDetails, setReportDetails] = useState("");
    const [reportList, setReportList] = useState([]);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    const [showFullDesc, setShowFullDesc] = useState(false);
    const toggleDesc = () => setShowFullDesc(!showFullDesc);

    // kiểm tra đăng nhập trước khi báo cáo
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        if (user == null) {
            alert("You need to login to report a story");
            // Chuyển hướng đến trang truyện trước đó
            // navigate(`/storypage/${storyId}`);
            return;
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

    // kiểm tra xem story đã được lấy thành công hay chưa
    // nếu có thì log ra console để kiểm tra
    useEffect(() => {
        if (story) { // Chỉ log khi story có giá trị (không phải null ban đầu)
            console.log("Story fetched and updated in state:", story);
            setReportList(story.reports || []); // Giả sử story có thuộc tính reports chứa danh sách báo cáo
            // navigate(`/`);
        }
    }, [story]); // Dependency array: chạy lại mỗi khi biến 'story' thay đổi

    const sendReport = () => {
        if (!report || !reportDetails) {
            alert("Please fill in all fields");
            return;
        }

        const newReport = {
            reportType: "story",
            reportedUserId: null,
            reportedStoryId: storyId,
            reporterUserId: user.id,
            reason: report,
            details: reportDetails,
            status: "pending",
            createdAt: new Date().toISOString(),
            resolvedBy: null,
            resolvedAt: null
        };

        
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
                    {showForm ? (
                        renderForm()
                    ) : <Button onClick={() => setShowForm(true)}>Thêm báo cáo </Button>
                    }

                    <h4>Danh sách báo cáo bạn đã gửi</h4>

                    {/* To Do: hiển thị danh sách các báo cáo đã gửi (giảm dần theo thời gian) */}
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    );
}