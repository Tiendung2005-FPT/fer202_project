import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";



export default function ReportStory() {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [user, setUser] = useState(null);
    const [report, setReport] = useState("");
    const [reportDetails, setReportDetails] = useState("");
    const [reportList, setReportList] = useState([]);
    const navigate = useNavigate();

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
    );
}