import React from "react";
import { Row, Col, Card, Table, ListGroup } from "react-bootstrap";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <AdminSidebar>
      {/* Nội dung bên trong */}
      <Row className="mb-4">
        <Col><Card><Card.Body>📚 <h5>16 Sách</h5></Card.Body></Card></Col>
        <Col><Card><Card.Body>👤 <h5>3 Độc giả</h5></Card.Body></Card></Col>
        <Col><Card><Card.Body>🧑‍💻 <h5>5 Tài khoản</h5></Card.Body></Card></Col>
        <Col><Card><Card.Body>🛒 <h5>12 Lượt mượn sách</h5></Card.Body></Card></Col>
      </Row>

      {/* Danh sách */}
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>Sách mới</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead><tr><th>Tên sách</th><th>Tác giả</th><th>Thể loại</th></tr></thead>
                <tbody>
                  <tr><td>LINUX</td><td>Thịnh</td><td>CNTT</td></tr>
                  <tr><td>JAVA</td><td>Codegym</td><td>CNTT</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Độc giả mới</Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>📧 quynh147@email.com</ListGroup.Item>
                <ListGroup.Item>📧 docgia1@gmail.com</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminSidebar>
  );
}
