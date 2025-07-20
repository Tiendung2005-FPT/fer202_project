import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const acc = JSON.parse(localStorage.getItem("userAccount"));
  const idAdmin = acc.id


  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };
    fetchUserDetail();
  }, [id]);

  const handleEditClick = () => {
    setEditData({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      username: user?.username || "",
      bio: user?.bio || "",
      updatedAt: user?.updatedAt || "",
    });
    setEditing(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (window.confirm('Bạn chắc chắn với thay đổi không?')) {
      setUser({ ...user, ...editData, updatedAt: new Date().toISOString() });
      setEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/362/362003.png"
              }
              style={{
                width: 150,
                height: 150,
                objectFit: "cover",
                margin: "2rem auto 0",
                borderRadius: "50%",
              }}
            />
            <Card.Body className="text-center">
              <Card.Title>{user?.username || "Unknown"}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user?.bio}
              </Card.Subtitle>
           
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              {editing ? (
                <Form>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formFullname">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={editData.fullname}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="bio"
                      value={editData.bio}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Button variant="success" className="me-2" onClick={handleEditSave} type="button">Save</Button>
                  <Button variant="secondary" onClick={handleEditCancel} type="button">Cancel</Button>
                </Form>
              ) : (
                <Table borderless className="mb-0">
                  <tbody>
                    <tr>
                      <th style={{ width: "150px" }}>Full Name</th>
                      <td>{user?.fullname}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{user?.email}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{user?.phone}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{user?.address}</td>
                    </tr>
                  </tbody>
                </Table>
              )}

              {!editing && idAdmin === id &&(
                <Button
                  variant="info"
                  className="mt-3"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default UserDetail;
