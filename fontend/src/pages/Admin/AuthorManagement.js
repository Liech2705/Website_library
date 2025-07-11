import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import BookTabs from "../../components/BookTabs";
import "../style.css";
import ApiServiceAdmin from "../../services/admin/api";


export default function AuthorManagement() {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({ name: "", bio: "", status: 1 });
  const [deletingAuthorId, setDeletingAuthorId] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await ApiServiceAdmin.getAuthors();
        setAuthors(res);
      } catch (err) {
        //
      }
    }

    fetchAuthors();
  })

  const filteredAuthors = authors.filter((author) =>
    (author.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAuthor = async () => {
    if (editingAuthor) {
      try {
        await ApiServiceAdmin.updateAuthor(editingAuthor.id, newAuthor);
        // Sau khi cập nhật, reload lại danh sách
        const res = await ApiServiceAdmin.getAuthors();
        setAuthors(res);
        setShowToast(true);
      } catch (err) {
        alert('Lỗi khi cập nhật tác giả: ' + err.message);
      }
    } else {
      try {
        await ApiServiceAdmin.addAuthor(newAuthor);
        // Sau khi thêm, reload lại danh sách
        const res = await ApiServiceAdmin.getAuthors();
        setAuthors(res);
        setShowToast(true);
      } catch (err) {
        alert('Lỗi khi thêm tác giả: ' + err.message);
      }
    }
    setShowModal(false);
    setEditingAuthor(null);
    setNewAuthor({ name: "", bio: "", status: 1 });
  };

  const handleEditClick = (author) => {
    setEditingAuthor(author);
    setNewAuthor(author);
    setShowModal(true);
  };

  const handleDeleteAuthor = async () => {
    try {
      await ApiServiceAdmin.deleteAuthor(deletingAuthorId);
      // Sau khi xóa, reload lại danh sách
      const res = await ApiServiceAdmin.getAuthors();
      setAuthors(res);
      setShowToast(true);
    } catch (err) {
      alert('Lỗi khi xóa tác giả: ' + err.message);
    }
    setDeletingAuthorId(null);
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
                <td>{author.bio}</td>
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
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
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
