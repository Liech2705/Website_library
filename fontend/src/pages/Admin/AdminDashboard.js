import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, ListGroup, Spinner } from "react-bootstrap";
import AdminSidebar from "../../components/AdminSidebar";
import ApiService from "../../services/admin/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ books: 0, readers: 0, accounts: 0, borrows: 0 });
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

  if (loading) {
    return (
      <AdminSidebar>
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <Row className="mb-4">
        <Col><Card><Card.Body>📚 <h5>{summary.books} Sách</h5></Card.Body></Card></Col>
        <Col><Card><Card.Body>🧑‍💻 <h5>{summary.accounts} Tài khoản</h5></Card.Body></Card></Col>
        <Col><Card><Card.Body>🛒 <h5>{summary.borrows} Lượt mượn sách</h5></Card.Body></Card></Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>Sách mới</Card.Header>
            <Card.Body>
              <Table responsive>
                <thead><tr><th>Tên sách</th><th>Tác giả</th><th>Thể loại</th></tr></thead>
                <tbody>
                  {newBooks.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.authors?.map(a => a.name).join(", ")}</td>
                      <td>{book.category?.name}</td>
                    </tr>
                  ))}
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
                {newReaders.map((reader) => (
                  <ListGroup.Item key={reader.id}>📧 {reader.email}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminSidebar>
  );
}
