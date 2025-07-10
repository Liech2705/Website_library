import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import ApiServiceAdmin from "../../services/admin/api";
import "../style.css";

export default function BorrowManagement() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await ApiServiceAdmin.getBorrowRecords();
        // Gán mock status để test các tab
        const withStatus = res.map((r, i) => ({
          ...r,
          status: i % 3 === 0 ? "pending" : r.returned ? "returned" : "borrowing"
        }));
        setBorrowRecords(withStatus);
      } catch (error) {
        console.error("Lỗi khi tải phiếu mượn:", error);
      }
    };
    fetchRecords();
  }, []);

  const handleApprove = (id) => {
    setBorrowRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "borrowing" } : r))
    );
  };

  const handleReject = () => {
    alert(`📩 Đã gửi lý do từ chối phiếu #${rejectingId}: ${rejectionReason}`);
    setBorrowRecords((prev) => prev.filter((r) => r.id !== rejectingId));
    setShowRejectModal(false);
    setRejectionReason("");
    setRejectingId(null);
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
          <Button variant="success">+ Lập phiếu mượn</Button>
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
                  <td>{r.note}</td>
                  <td>
                    {selectedTab === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="me-2"
                          onClick={() => handleApprove(r.id)}
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setShowRejectModal(true);
                            setRejectingId(r.id);
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

      {/* Modal nhập lý do từ chối */}
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
    </AdminSidebarLayout>
  );
}
