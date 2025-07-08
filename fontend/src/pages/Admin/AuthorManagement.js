import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast, Badge } from "react-bootstrap";
import { PencilFill, TrashFill, InfoCircleFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import BookTabs from "../../components/BookTabs";
import "../style.css";

const mockAuthors = [
  {
    id: 1,
    name: "Nguyễn Nhật Ánh",
    email: "anh@example.com",
    phone: "0912345678",
    address: "TP. Hồ Chí Minh",
    birthYear: 1955,
    status: 1,
  },
  {
    id: 2,
    name: "Yuval Noah Harari",
    email: "harari@example.com",
    phone: "0987654321",
    address: "Israel",
    birthYear: 1976,
    status: 1,
  },
  {
    id: 3,
    name: "Osho",
    email: "osho@example.com",
    phone: "0909090909",
    address: "Ấn Độ",
    birthYear: 1931,
    status: 0,
  },
];

export default function AuthorManagement() {
  const [authors, setAuthors] = useState(mockAuthors);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthYear: "",
    status: 1,
  });
  const [deletingAuthorId, setDeletingAuthorId] = useState(null);
  const authorsPerPage = 10;

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage);
  const indexOfLast = currentPage * authorsPerPage;
  const indexOfFirst = indexOfLast - authorsPerPage;
  const currentAuthors = filteredAuthors.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const renderStatus = (status) =>
    status === 1 ? (
      <Badge bg="success">Hoạt động</Badge>
    ) : (
      <Badge bg="secondary">Ngừng</Badge>
    );

  const handleSaveAuthor = () => {
    if (editingAuthor) {
      setAuthors(
        authors.map((author) =>
          author.id === editingAuthor.id ? { ...editingAuthor, ...newAuthor } : author
        )
      );
    } else {
      setAuthors([
        ...authors,
        { id: authors.length + 1, ...newAuthor, birthYear: parseInt(newAuthor.birthYear) },
      ]);
    }

    setShowModal(false);
    setShowToast(true);
    setNewAuthor({ name: "", email: "", phone: "", address: "", birthYear: "", status: 1 });
    setEditingAuthor(null);
  };

  const handleEditClick = (author) => {
    setEditingAuthor(author);
    setNewAuthor(author);
    setShowModal(true);
  };

  const handleDeleteAuthor = () => {
    setAuthors(authors.filter((author) => author.id !== deletingAuthorId));
    setDeletingAuthorId(null);
    setShowToast(true);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">✍️ Quản lý tác giả</h4>

        <BookTabs />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm tác giả theo tên..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Thêm tác giả
          </Button>
        </div>

        <div className="scrollable-table-wrapper">
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên tác giả</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Năm sinh</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentAuthors.map((author) => (
                <tr key={author.id}>
                  <td>{author.id}</td>
                  <td>{author.name}</td>
                  <td>{author.email}</td>
                  <td>{author.phone}</td>
                  <td>{author.address}</td>
                  <td>{author.birthYear}</td>
                  <td>{renderStatus(author.status)}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEditClick(author)}
                    >
                      <PencilFill />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-1"
                      onClick={() => setDeletingAuthorId(author.id)}
                    >
                      <TrashFill />
                    </Button>
                    <Button variant="outline-info" size="sm">
                      <InfoCircleFill />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal thêm/sửa */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingAuthor ? "✏️ Sửa tác giả" : "➕ Thêm tác giả"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Tên tác giả</Form.Label>
                <Form.Control
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={newAuthor.email}
                  onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  value={newAuthor.phone}
                  onChange={(e) => setNewAuthor({ ...newAuthor, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  value={newAuthor.address}
                  onChange={(e) => setNewAuthor({ ...newAuthor, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Năm sinh</Form.Label>
                <Form.Control
                  type="number"
                  value={newAuthor.birthYear}
                  onChange={(e) => setNewAuthor({ ...newAuthor, birthYear: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={newAuthor.status}
                  onChange={(e) => setNewAuthor({ ...newAuthor, status: parseInt(e.target.value) })}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Ngừng</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSaveAuthor}>
              {editingAuthor ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận xóa */}
        <Modal show={!!deletingAuthorId} onHide={() => setDeletingAuthorId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa tác giả</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa tác giả này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingAuthorId(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteAuthor}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast thông báo */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          <Toast.Header>
            <strong className="me-auto">Thông báo</strong>
          </Toast.Header>
          <Toast.Body>
            ✅ {editingAuthor ? "Cập nhật tác giả thành công!" : deletingAuthorId === null ? "Thêm tác giả thành công!" : "Xóa tác giả thành công!"}
          </Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
