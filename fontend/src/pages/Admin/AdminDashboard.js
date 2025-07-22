import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  ListGroup,
  Spinner,
  Container,
} from "react-bootstrap";
import AdminSidebar from "../../components/AdminSidebar";
import ApiService from "../../services/admin/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    books: 0,
    readers: 0,
    accounts: 0,
    borrows: 0,
  });
  const [newBooks, setNewBooks] = useState([]);
  const [newReaders, setNewReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryRes, booksRes, readersRes] = await Promise.all([
          ApiService.getDashboardSummary(),
          ApiService.getNewBooks(),
          ApiService.getNewReaders(),
        ]);
        setSummary(summaryRes);
        setNewBooks(booksRes);
        setNewReaders(readersRes);
      } catch (err) {
        // Xử lý lỗi nếu cần
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const Content = () => (
    <Container fluid className="py-3">
      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5>📚 {summary.books} Sách</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5>🧑‍💻 {summary.accounts} Tài khoản</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5>🛒 {summary.borrows} Lượt mượn sách</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={8}>
          <Card className="h-100">
            <Card.Header>Sách mới</Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Tên sách</th>
                      <th>Tác giả</th>
                      <th>Thể loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newBooks.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.authors?.map((a) => a.name).join(", ")}</td>
                        <td>{book.category?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="h-100">
            <Card.Header>Độc giả mới</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {newReaders.map((reader) => (
                  <ListGroup.Item key={reader.id}>
                    📧 {reader.email}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  return loading ? (
    <AdminSidebar>
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    </AdminSidebar>
  ) : (
    <AdminSidebar>
      <Content />
    </AdminSidebar>
  );
}
