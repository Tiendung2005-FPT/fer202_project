import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
  const fetchUserDetail = async () => {
    try{
        const response = await axios.get(`http://localhost:9998/users/${id}`);
        setUser(response.data);
    }catch(error){
        console.error("Error fetching user detail:", error);
    }
  };
  fetchUserDetail();
  },[id]);



  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/362/362003.png"} style={{width: 150, height: 150, objectFit: 'cover', margin: '2rem auto 0', borderRadius: '50%'}} />
            <Card.Body className="text-center">
              <Card.Title>{user?.username || "Unknown"}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{user?.bio}</Card.Subtitle>
              <Card.Text>{user?.isVIP ? (
                  <span className="text-success fw-bold">VIP: Có</span>
                ) : (
                  <span className="text-danger fw-bold">VIP: Không</span>
                )}
                </Card.Text>
              <div className="d-flex justify-content-center gap-2">
                <Button variant="primary">Follow</Button>
            
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <th style={{width: '150px'}}>Full Name</th>
                    <td>{user?.fullname}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>{user?.phone }</td>
                  </tr>           
                  <tr>
                    <th>Address</th>
                    <td>{user?.address }</td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="info" className="mt-3">Edit</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default UserDetail;
