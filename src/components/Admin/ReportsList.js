import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ReportsList() {
    const [userReportCounts, setUserReportCounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:9999/reports/?reportType=user&status=review")
            .then(res => {
                const counts = {};
                res.data.forEach(r => {
                    const id = r.reportedUserId;
                    counts[id] = (counts[id] || 0) + 1;
                });

                const sortedUsers = Object.entries(counts)
                    .sort((a, b) => b[1] - a[1]) // sort by report count desc
                    .map(([userId, count]) => ({ userId, count }));

                setUserReportCounts(sortedUsers);
            });
    }, []);

    return (
        <Container className="mt-4">
            <h2>Báo cáo người dùng</h2>
            {userReportCounts.length === 0 ? (
                <p>Không có báo cáo nào.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Người dùng bị báo cáo</th>
                            <th>Số lượng báo cáo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userReportCounts.map((user, index) => (
                            <tr key={user.userId} onClick={() => navigate(`/user-report-detail/${user.userId}`)}>
                                <td>{index + 1}</td>
                                <td>
                                    {user.userId}
                                </td>
                                <td>{user.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
