import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import BookTabs from "../../components/BookTabs";
import "../style.css";

const mockAuthors = [
  { id: 1, name: "Nguyễn Nhật Ánh", address: "Nhà văn nổi tiếng với truyện tuổi học trò", status: 1 },
  { id: 2, name: "Yuval Noah Harari", address: "Tác giả của Sapiens và Homo Deus", status: 1 },
  { id: 3, name: "Osho", address: "Diễn giả tâm linh và triết học phương Đông", status: 0 },
];

export default function AuthorManagement() {
  const [authors, setAuthors] = useState(mockAuthors);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({ name: "", address: "", status: 1 });
  const [deletingAuthorId, setDeletingAuthorId] = useState(null);

  const filteredAuthors = authors.filter((author) =>
    (author.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAuthor = () => {
    if (editingAuthor) {
      setAuthors(authors.map((a) => (a.id === editingAuthor.id ? { ...editingAuthor, ...newAuthor } : a)));
    } else {
      setAuthors([...authors, { id: authors.length + 1, ...newAuthor }]);
    }
    setShowModal(false);
    setShowToast(true);
    setEditingAuthor(null);
    setNewAuthor({ name: "", address: "", status: 1 });
  };

  const handleEditClick = (author) => {
    setEditingAuthor(author);
    setNewAuthor(author);
    setShowModal(true);
  };

  const handleDeleteAuthor = () => {
    setAuthors(authors.filter((a) => a.id !== deletingAuthorId));
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
            placeholder="🔍 Tìm tác giả..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" onClick={() => { setShowModal(true); setEditingAuthor(null); }}>
            + Thêm tác giả
          </Button>
        </div>

        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên tác giả</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.map((author) => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.address}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEditClick(author)}>
                    <PencilFill />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => setDeletingAuthorId(author.id)}>
                    <TrashFill />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal Thêm/Sửa */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingAuthor ? "✏️ Sửa tác giả" : "➕ Thêm tác giả"}</Modal.Title>
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
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newAuthor.address}
                  onChange={(e) => setNewAuthor({ ...newAuthor, address: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" onClick={handleSaveAuthor}>
              {editingAuthor ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Xác nhận xóa */}
        <Modal show={!!deletingAuthorId} onHide={() => setDeletingAuthorId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa tác giả này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingAuthorId(null)}>Hủy</Button>
            <Button variant="danger" onClick={handleDeleteAuthor}>Xóa</Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2500}
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
