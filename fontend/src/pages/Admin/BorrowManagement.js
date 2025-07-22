import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import ApiServiceAdmin from "../../services/admin/api";
import ApiService from "../../services/api";
import "../style.css";

export default function BorrowManagement() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [newBorrow, setNewBorrow] = useState({
    reader: "",
    bookTitle: "",
    publisher: "",
    publishYear: "",
    borrowDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    note: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await ApiServiceAdmin.getBorrowRecords();
        setBorrowRecords(res);
      } catch (error) {
        console.error("Lỗi khi tải phiếu mượn:", error);
      }
    };

    const fetchBooks = async () => {
      try {
        const res = await ApiService.getBooks();
        setBooks(res);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách:", error);
      }
    };

    fetchRecords();
    fetchBooks();
  }, []);

  const handleApprove = async (id) => {
    try {
      await ApiServiceAdmin.approveBorrows(id);
      const res = await ApiServiceAdmin.getBorrowRecords();
      setBorrowRecords(res);
    } catch (error) {
      alert('Lỗi khi duyệt phiếu: ' + error.message);
    }
  };

  const handleReject = async () => {
    try {
      await ApiServiceAdmin.rejectBorrow(rejectingId, rejectionReason);
      const res = await ApiServiceAdmin.getBorrowRecords();
      setBorrowRecords(res);
    } catch (error) {
      alert('Lỗi khi từ chối phiếu: ' + error.message);
    }
    setShowRejectModal(false);
    setRejectionReason("");
    setRejectingId(null);
  };

  const handleCreateBorrow = async () => {
    try {
      await ApiServiceAdmin.createBorrowRecord(newBorrow);
      const res = await ApiServiceAdmin.getBorrowRecords();
      setBorrowRecords(res);
      setShowCreateModal(false);
      setNewBorrow({
        reader: "",
        bookTitle: "",
        publisher: "",
        publishYear: "",
        borrowDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        note: "",
      });
    } catch (error) {
      alert("Lỗi khi tạo phiếu mượn: " + error.message);
    }
  };

  const filteredByTab = borrowRecords.filter((r) => r.status === selectedTab);
  const filteredRecords = filteredByTab.filter((r) =>
    r.reader.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleBookTitleChange = (title) => {
    const found = books.find((b) => b.title === title);
    if (found) {
      setNewBorrow({
        ...newBorrow,
        bookTitle: found.title,
        publisher: found.publisher,
        publishYear: found.publishYear || "",
      });
    } else {
      setNewBorrow({ ...newBorrow, bookTitle: title });
    }
  };

  const formatOverdueTime = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(23, 0, 0, 0);
    const now = new Date();
    if (now <= dueDate) return "-";
    const diffMs = now - dueDate;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return days > 0 ? `${days} ngày ${hours}h` : `${hours}h`;
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        {/* Tabs */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {["pending", "borrowing", "returned"].map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? "dark" : "outline-dark"}
                className="me-2"
                onClick={() => {
                  setSelectedTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === "pending"
                  ? "Phiếu chờ duyệt"
                  : tab === "borrowing"
                    ? "Phiếu đang mượn"
                    : "Phiếu đã trả"}
              </Button>
            ))}
          </div>
          <Button variant="success" onClick={() => setShowCreateModal(true)}>
            + Lập phiếu mượn
          </Button>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="🔍 Tìm theo tên độc giả hoặc sách..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="scrollable-table-wrapper">
          <table className="table table-striped table-bordered table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>Số phiếu</th>
                <th>Tên độc giả</th>
                <th>Tên sách</th>
                <th>Số lượng mượn</th>
                <th>Ngày tạo phiếu</th>
                <th>Ngày hẹn trả</th>
                <th>Ngày quá hạn</th>
                <th>Ghi chú mượn</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.reader}</td>
                  <td>{r.bookTitle}</td>
                  <td>{r.quantity}</td>
                  <td>{new Date(r.borrowDate).toLocaleString()}</td>
                  <td>{new Date(r.dueDate).toLocaleString()}</td>
                  <td>{r.status === "borrowed" ? formatOverdueTime(r.dueDate) : "-"}</td>
                  <td>{r.note}</td>
                  <td>
                    {selectedTab === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="me-2"
                          onClick={() => handleApprove(r.id_bookcopy)}
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setShowRejectModal(true);
                            setRejectingId(r.id_bookcopy);
                          }}
                        >
                          Từ chối
                        </Button>
                      </>
                    ) : selectedTab === "borrowing" ? (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => alert(`Trả sách phiếu #${r.id}`)}
                      >
                        Trả sách
                      </Button>
                    ) : (
                      <span className="text-muted">✓ Đã trả</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-3 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modal từ chối */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Lý do từ chối</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Gửi lý do
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal lập phiếu mượn */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Lập phiếu mượn mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên độc giả</Form.Label>
              <Form.Control
                type="text"
                value={newBorrow.reader}
                onChange={(e) => setNewBorrow({ ...newBorrow, reader: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên sách</Form.Label>
              <Form.Control
                list="book-options"
                type="text"
                value={newBorrow.bookTitle}
                onChange={(e) => handleBookTitleChange(e.target.value)}
              />
              <datalist id="book-options">
                {books.map((b, i) => (
                  <option key={i} value={b.title} />
                ))}
              </datalist>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nhà xuất bản</Form.Label>
              <Form.Control
                type="text"
                value={newBorrow.publisher}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày tạo phiếu</Form.Label>
              <Form.Control type="date" value={newBorrow.borrowDate} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày hẹn trả</Form.Label>
              <Form.Control type="date" value={newBorrow.dueDate} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newBorrow.note}
                onChange={(e) => setNewBorrow({ ...newBorrow, note: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateBorrow}>
            Tạo phiếu
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminSidebarLayout>
  );
}

