import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function ViewAcc() {
    const { accId } = useParams();
    const [acc, setAcc] = useState(null)

    useEffect(() => {
        axios.get(`http://localhost:9999/users/${accId}`)
            .then(result => setAcc(result.data))
            .catch(err => console.log(err))
    }, [accId])

    if (acc === null) {
        return <p>Đang tải dữ liệu tài khoản...</p>;
    }

    return (
        <Row>
            <Col>
                View acc {accId}
                <br></br>
                {acc.email}
            </Col>
        </Row>
    )
}