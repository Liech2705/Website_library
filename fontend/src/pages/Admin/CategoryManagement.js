import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill, InfoCircleFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import BookTabs from "../../components/BookTabs";
import "../style.css";
import ApiServiceAdmin from "../../services/admin/api";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ApiServiceAdmin.getCategories();
        setCategories(res);
      } catch (error) {
        console.error("Lỗi khi tải thể loại:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await ApiServiceAdmin.updateCategory(editingCategory.id, newCategory);
      } else {
        await ApiServiceAdmin.addCategory(newCategory);
      }
      const res = await ApiServiceAdmin.getCategories();
      setCategories(res);
      setShowToast(true);
    } catch (err) {
      alert(
        editingCategory
          ? "Lỗi khi cập nhật thể loại: " + err.message
          : "Lỗi khi thêm thể loại: " + err.message
      );
    }
    handleCloseModal();
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setNewCategory({ name: "", description: "" });
  };

  const handleDeleteCategory = async () => {
    try {
      await ApiServiceAdmin.deleteCategory(deletingCategoryId);
      const res = await ApiServiceAdmin.getCategories();
      setCategories(res);
      setShowToast(true);
    } catch (err) {
      alert("Lỗi khi xóa thể loại: " + err.message);
    }
    setDeletingCategoryId(null);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">📂 Quản lý thể loại</h4>

        <BookTabs />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên thể loại..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button
            variant="primary"
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({ name: "", description: "" });
              setShowModal(true);
            }}
          >
            + Thêm thể loại
          </Button>
        </div>

        <div className="scrollable-table-wrapper">
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên thể loại</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEditClick(cat)}
                    >
                      <PencilFill />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-1"
                      onClick={() => setDeletingCategoryId(cat.id)}
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
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategory ? "✏️ Sửa thể loại" : "📁 Thêm thể loại"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Tên thể loại</Form.Label>
                <Form.Control
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSaveCategory}>
              {editingCategory ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận xóa */}
        <Modal show={!!deletingCategoryId} onHide={() => setDeletingCategoryId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa thể loại</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa thể loại này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingCategoryId(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteCategory}>
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
            ✅ {editingCategory ? "Cập nhật thể loại thành công!" : deletingCategoryId === null ? "Thêm thể loại thành công!" : "Xóa thể loại thành công!"}
          </Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
