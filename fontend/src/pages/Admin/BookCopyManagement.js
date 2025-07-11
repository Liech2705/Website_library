import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill, Plus } from "react-bootstrap-icons";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";

// 🔹 Mock dữ liệu bản sao
const mockCopies = [
  { id: 1, id_book: 1, copynumber: "COPY-1-1", year: 2020, status: "borrowed", location: "Kho sách cũ" },
  { id: 2, id_book: 1, copynumber: "COPY-1-2", year: 2021, status: "available", location: "Kệ A1" },
  { id: 3, id_book: 1, copynumber: "COPY-1-3", year: 2022, status: "available", location: "Kệ A1" },
  { id: 4, id_book: 2, copynumber: "COPY-2-1", year: 2020, status: "borrowed", location: "Kho sách cũ" },
];

export default function BookCopyManagement() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [copies, setCopies] = useState(mockCopies.filter(c => c.id_book === parseInt(bookId)));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const copiesPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingCopy, setEditingCopy] = useState(null);
  const [newCopy, setNewCopy] = useState({ copynumber: "", year: "", status: "available", location: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const filtered = copies.filter(copy =>
    copy.copynumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / copiesPerPage);
  const indexOfLast = currentPage * copiesPerPage;
  const currentCopies = filtered.slice(indexOfLast - copiesPerPage, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleAddNew = () => {
    setNewCopy({ copynumber: "", year: "", status: "available", location: "" });
    setEditingCopy(null);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCopy) {
      setCopies(copies.map(copy =>
        copy.id === editingCopy.id ? { ...editingCopy, ...newCopy } : copy
      ));
    } else {
      const newId = copies.length ? Math.max(...copies.map(c => c.id)) + 1 : 1;
      setCopies([...copies, {
        ...newCopy,
        id: newId,
        id_book: parseInt(bookId),
        year: parseInt(newCopy.year)
      }]);
    }

    setShowModal(false);
    setShowConfirmModal(false);
    setShowToast(true);
  };

  const handleEdit = (copy) => {
    setEditingCopy(copy);
    setNewCopy(copy);
    setShowModal(true);
  };

  const handleDelete = () => {
    setCopies(copies.filter(copy => copy.id !== deletingId));
    setDeletingId(null);
    setShowToast(true);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">📑 Quản lý bản sao sách (ID sách: {bookId})</h4>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm theo mã bản sao..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div>
            <Button variant="success" className="me-2" onClick={handleAddNew}>
              <Plus /> Thêm bản sao
            </Button>
            <Button variant="secondary" onClick={() => navigate("/admin/bookmanagement")}>
              ← Quay lại danh sách sách
            </Button>
          </div>
        </div>

        <div className="scrollable-table-wrapper">
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Mã bản sao</th>
                <th>Năm</th>
                <th>Trạng thái</th>
                <th>Vị trí</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentCopies.map((copy, index) => (
                <tr key={copy.id}>
                  <td>{indexOfLast - copiesPerPage + index + 1}</td>
                  <td>{copy.copynumber}</td>
                  <td>{copy.year}</td>
                  <td>
                    {copy.status === "available"
                      ? <span className="text-success">Còn</span>
                      : <span className="text-danger">Đang mượn</span>}
                  </td>
                  <td>{copy.location}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEdit(copy)}>
                      <PencilFill />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeletingId(copy.id)}>
                      <TrashFill />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

        {/* Modal thêm/sửa */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingCopy ? "✏️ Chỉnh sửa bản sao" : "➕ Thêm bản sao mới"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Mã bản sao</Form.Label>
                <Form.Control
                  value={newCopy.copynumber}
                  onChange={(e) => setNewCopy({ ...newCopy, copynumber: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Năm</Form.Label>
                <Form.Control
                  type="number"
                  value={newCopy.year}
                  onChange={(e) => setNewCopy({ ...newCopy, year: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={newCopy.status}
                  onChange={(e) => setNewCopy({ ...newCopy, status: e.target.value })}
                >
                  <option value="available">Còn</option>
                  <option value="borrowed">Đang mượn</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Vị trí</Form.Label>
                <Form.Control
                  value={newCopy.location}
                  onChange={(e) => setNewCopy({ ...newCopy, location: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
            <Button variant="success" onClick={() => {
              setShowModal(false);
              setShowConfirmModal(true);
            }}>
              {editingCopy ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận thêm/sửa */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingCopy ? "Xác nhận chỉnh sửa" : "Xác nhận thêm bản sao"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingCopy
              ? "Bạn có chắc muốn lưu thay đổi bản sao này không?"
              : "Bạn có chắc chắn muốn thêm bản sao mới không?"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleSave}>Xác nhận</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xóa */}
        <Modal show={!!deletingId} onHide={() => setDeletingId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa bản sao này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingId(null)}>Hủy</Button>
            <Button variant="danger" onClick={handleDelete}>Xóa</Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          <Toast.Header><strong className="me-auto">Thông báo</strong></Toast.Header>
          <Toast.Body>✅ Thao tác thành công!</Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
