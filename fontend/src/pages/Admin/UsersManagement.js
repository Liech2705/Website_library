import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill, InfoCircleFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";

const mockReaders = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: 0,
    status: 1,
    lock_until: null,
    id_infor: 101,
    infor: {
      phone: "0123456789",
      address: "Hà Nội",
      school_name: "Đại học Bách Khoa",
    },
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: 0,
    status: 1,
    lock_until: null,
    id_infor: 102,
    infor: {
      phone: "0987654321",
      address: "TP. Hồ Chí Minh",
      school_name: "Đại học Kinh tế",
    },
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: 0,
    status: 1,
    lock_until: null,
    id_infor: 103,
    infor: null,
  },
];

export default function UsersManagement() {
  const [readers, setReaders] = useState(mockReaders);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingReader, setEditingReader] = useState(null);
  const [newReader, setNewReader] = useState({ name: "", email: "", infor: { school_name: "", phone: "", address: "" } });
  const [deletingReaderId, setDeletingReaderId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const itemsPerPage = 10;

  const filteredReaders = readers.filter((reader) =>
    reader.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReaders.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReaders = filteredReaders.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSaveReader = () => {
    if (editingReader) {
      setReaders(
        readers.map((r) =>
          r.id === editingReader.id ? { ...editingReader, ...newReader } : r
        )
      );
    } else {
      setReaders([
        ...readers,
        { id: readers.length + 1, role: 0, status: 1, lock_until: null, id_infor: 100 + readers.length + 1, ...newReader },
      ]);
    }
    setShowModal(false);
    setShowToast(true);
    setNewReader({ name: "", email: "", infor: { school_name: "", phone: "", address: "" } });
    setEditingReader(null);
  };

  const handleEditClick = (reader) => {
    setEditingReader(reader);
    setNewReader({ ...reader, infor: reader.infor || { school_name: "", phone: "", address: "" } });
    setShowModal(true);
  };

  const handleDeleteReader = () => {
    setReaders(readers.filter((r) => r.id !== deletingReaderId));
    setDeletingReaderId(null);
    setShowToast(true);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">👤 Quản lý người dùng</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Thêm người dùng</Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên người dùng..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="scrollable-table-wrapper">
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Trường</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentReaders.map((reader, index) => (
                <tr key={`${reader.id}-${index}`}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{reader.name}</td>
                  <td>{reader.email}</td>
                  <td>{reader.infor?.school_name || "—"}</td>
                  <td>{reader.infor?.phone || "—"}</td>
                  <td>{reader.infor?.address || "—"}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEditClick(reader)}>
                      <PencilFill />
                    </Button>
                    <Button variant="outline-danger" size="sm" className="me-1" onClick={() => setDeletingReaderId(reader.id)}>
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

        {totalPages > 1 && (
          <div className="mt-3 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal thêm/sửa */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingReader ? "✏️ Sửa người dùng" : "👤 Thêm người dùng"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  value={newReader.name}
                  onChange={(e) => setNewReader({ ...newReader, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newReader.email}
                  onChange={(e) => setNewReader({ ...newReader, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Trường</Form.Label>
                <Form.Control
                  value={newReader.infor.school_name}
                  onChange={(e) => setNewReader({ ...newReader, infor: { ...newReader.infor, school_name: e.target.value } })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  value={newReader.infor.phone}
                  onChange={(e) => setNewReader({ ...newReader, infor: { ...newReader.infor, phone: e.target.value } })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  value={newReader.infor.address}
                  onChange={(e) => setNewReader({ ...newReader, infor: { ...newReader.infor, address: e.target.value } })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSaveReader}>
              {editingReader ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận xóa */}
        <Modal show={!!deletingReaderId} onHide={() => setDeletingReaderId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa người dùng này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingReaderId(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteReader}>
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
            ✅ {editingReader ? "Cập nhật người dùng thành công!" : deletingReaderId === null ? "Thêm người dùng thành công!" : "Xóa người dùng thành công!"}
          </Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
