import React, { useState } from "react";
import { Table, Button, Modal, Form, Toast } from "react-bootstrap";
import { PencilFill, TrashFill, InfoCircleFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import BookTabs from "../../components/BookTabs";
import Pagination from "../../components/Pagination";
import "../style.css";

 const mockBooks = [
  {
    id: 1,
    title: "Bí mật của hoa vàng",
    author: "Osho",
    category: "Triết học",
    publisher: "NXB Lao Động",
    description: "Một tác phẩm tâm linh giúp bạn hiểu rõ bản thân.",
    year: 2010,
    quantity: 10,
    borrowed: 4,
    location: "Kệ A3",
  },
  {
    id: 2,
    title: "Cây cam ngọt của tôi",
    author: "José Mauro de Vasconcelos",
    category: "Văn học thiếu nhi",
    publisher: "NXB Kim Đồng",
    description: "Câu chuyện cảm động về tuổi thơ và lòng trắc ẩn.",
    year: 2012,
    quantity: 7,
    borrowed: 2,
    location: "Kệ B1",
  },
  {
    id: 3,
    title: "Lược sử loài người",
    author: "Yuval Noah Harari",
    category: "Lịch sử",
    publisher: "NXB Thế Giới",
    description: "Khái quát tiến trình phát triển của nhân loại từ sơ khai đến hiện đại.",
    year: 2018,
    quantity: 12,
    borrowed: 5,
    location: "Kệ C2",
  },
];
const categories = ["Triết học", "Lịch sử", "Văn học thiếu nhi"];
const authors = ["Osho", "Yuval Noah Harari", "José Mauro de Vasconcelos"];
const publishers = ["NXB Kim Đồng", "NXB Lao Động", "NXB Thế Giới"];


export default function BookManagement() {
  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    quantity: "",
    location: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBookId, setDeletingBookId] = useState(null);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleAddBook = () => {
    if (editingBook) {
      setBooks(
        books.map((book) =>
          book.id === editingBook.id ? { ...editingBook, ...newBook } : book
        )
      );
    } else {
      setBooks([
        ...books,
        {
          id: books.length + 1,
          ...newBook,
          year: parseInt(newBook.year),
          quantity: parseInt(newBook.quantity),
          borrowed: 0,
        },
      ]);
    }

    setShowAddModal(false);
    setShowConfirmModal(false);
    setShowToast(true);
    setNewBook({ title: "", author: "", category: "", year: "", quantity: "", location: "" });
    setEditingBook(null);
  };

  const handleEditClick = (book) => {
    setNewBook(book);
    setEditingBook(book);
    setShowAddModal(true);
  };

  const handleDeleteBook = () => {
    setBooks(books.filter((book) => book.id !== deletingBookId));
    setDeletingBookId(null);
    setShowToast(true);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">📚 Quản lý sách</h4>

        <BookTabs />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm sách theo tên..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Thêm sách
          </Button>
        </div>

        <div className="scrollable-table-wrapper">
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th>Nhà xuất bản</th>
                <th>Mô tả</th>
                <th>Năm XB</th>
                <th>Số bản sao</th>
                <th>Vị trí</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book, index) => (
                <tr key={`${book.id}-${index}`}>
                  <td>{indexOfFirstBook + index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.publisher}</td>
      <           td>{book.description}</td>
                  <td>{book.year}</td>
                  <td>{book.quantity}</td>
                  <td>{book.location}</td>
                  <td>{`${book.borrowed}/${book.quantity} đang mượn`}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEditClick(book)}>
                      <PencilFill />
                    </Button>
                    <Button variant="outline-danger" size="sm" className="me-1" onClick={() => setDeletingBookId(book.id)}>
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

        {/* Modal thêm/sửa sách */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingBook ? "✏️ Chỉnh sửa sách" : "📖 Thêm sách mới"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Tên sách</Form.Label>
                <Form.Control
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                  <Form.Label>Tác giả</Form.Label>
                  <Form.Select
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  >
                    <option value="">-- Chọn tác giả --</option>
                    {authors.map((author, idx) => (
                      <option key={idx} value={author}>{author}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Thể loại</Form.Label>
                      <Form.Select
                        value={newBook.category}
                        onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                      >
                        <option value="">-- Chọn thể loại --</option>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Nhà xuất bản</Form.Label>
                <Form.Select
                  value={newBook.publisher}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                >
                  <option value="">-- Chọn NXB --</option>
                  {publishers.map((pub, idx) => (
                    <option key={idx} value={pub}>{pub}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Năm xuất bản</Form.Label>
                <Form.Control
                  type="number"
                  value={newBook.year}
                  onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  value={newBook.quantity}
                  onChange={(e) => setNewBook({ ...newBook, quantity: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Vị trí</Form.Label>
                <Form.Control
                  value={newBook.location}
                  onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Đóng
            </Button>
            <Button variant="success" onClick={() => {
              setShowAddModal(false);
              setShowConfirmModal(true);
            }}>
              {editingBook ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận thêm/sửa */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingBook ? "Xác nhận chỉnh sửa" : "Xác nhận thêm sách"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingBook ? "Bạn có chắc muốn lưu thay đổi cho sách này không?" : "Bạn có chắc chắn muốn thêm sách mới không?"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleAddBook}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận xóa */}
        <Modal show={!!deletingBookId} onHide={() => setDeletingBookId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa sách</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa sách này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingBookId(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteBook}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Thông báo */}
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
            ✅ {editingBook ? "Cập nhật sách thành công!" : deletingBookId === null ? "Thêm sách thành công!" : "Xóa sách thành công!"}
          </Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
