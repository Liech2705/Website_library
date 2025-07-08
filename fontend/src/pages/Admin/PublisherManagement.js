import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast, Badge } from "react-bootstrap";
import { PencilFill, TrashFill, InfoCircleFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import BookTabs from "../../components/BookTabs";
import "../style.css";

const mockPublishers = [
  {
    id: 1,
    name: "NXB Kim Đồng",
    email: "contact@kimdong.vn",
    phone: "02438225555",
    address: "Hà Nội",
    status: 1,
  },
  {
    id: 2,
    name: "NXB Trẻ",
    email: "info@nxbtre.com.vn",
    phone: "02839309225",
    address: "TP. Hồ Chí Minh",
    status: 1,
  },
  {
    id: 3,
    name: "NXB Giáo Dục",
    email: "support@gdvn.vn",
    phone: "02438682288",
    address: "Hà Nội",
    status: 0,
  },
];

export default function PublisherManagement() {
  const [publishers, setPublishers] = useState(mockPublishers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [newPublisher, setNewPublisher] = useState({ name: "", email: "", phone: "", address: "", status: 1 });
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPublishers = filteredPublishers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSave = () => {
    if (editingPublisher) {
      setPublishers(publishers.map((pub) => pub.id === editingPublisher.id ? { ...editingPublisher, ...newPublisher } : pub));
    } else {
      setPublishers([...publishers, { id: publishers.length + 1, ...newPublisher }]);
    }
    setShowModal(false);
    setShowToast(true);
    setNewPublisher({ name: "", email: "", phone: "", address: "", status: 1 });
    setEditingPublisher(null);
  };

  const handleEdit = (pub) => {
    setEditingPublisher(pub);
    setNewPublisher(pub);
    setShowModal(true);
  };

  const handleDelete = () => {
    setPublishers(publishers.filter((p) => p.id !== deletingId));
    setDeletingId(null);
    setShowToast(true);
  };

  const renderStatus = (status) =>
    status === 1 ? <Badge bg="success">Hoạt động</Badge> : <Badge bg="secondary">Ngừng</Badge>;

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">🏢 Quản lý nhà xuất bản</h4>

        <BookTabs />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm NXB theo tên..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Thêm NXB</Button>
        </div>

        <div className="scrollable-table-wrapper">
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên NXB</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentPublishers.map((pub, index) => (
                <tr key={`${pub.id}-${index}`}>
                  <td>{pub.id}</td>
                  <td>{pub.name}</td>
                  <td>{pub.email}</td>
                  <td>{pub.phone}</td>
                  <td>{pub.address}</td>
                  <td>{renderStatus(pub.status)}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEdit(pub)}>
                      <PencilFill />
                    </Button>
                    <Button variant="outline-danger" size="sm" className="me-1" onClick={() => setDeletingId(pub.id)}>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingPublisher ? "✏️ Sửa NXB" : "📘 Thêm NXB"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Tên NXB</Form.Label>
                <Form.Control
                  value={newPublisher.name}
                  onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={newPublisher.email}
                  onChange={(e) => setNewPublisher({ ...newPublisher, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  value={newPublisher.phone}
                  onChange={(e) => setNewPublisher({ ...newPublisher, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  value={newPublisher.address}
                  onChange={(e) => setNewPublisher({ ...newPublisher, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={newPublisher.status}
                  onChange={(e) => setNewPublisher({ ...newPublisher, status: parseInt(e.target.value) })}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Ngừng</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" onClick={handleSave}>{editingPublisher ? "Lưu thay đổi" : "Thêm"}</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={!!deletingId} onHide={() => setDeletingId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa NXB</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa nhà xuất bản này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingId(null)}>Hủy</Button>
            <Button variant="danger" onClick={handleDelete}>Xóa</Button>
          </Modal.Footer>
        </Modal>

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
            ✅ {editingPublisher ? "Cập nhật NXB thành công!" : deletingId === null ? "Thêm NXB thành công!" : "Xóa NXB thành công!"}
          </Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
