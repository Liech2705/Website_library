// File: BorrowHistory.js
import React, { useEffect, useState } from "react";
import ToastMessage from "../components/ToastMessage";
import notificationSound from "../assets/thongbao.wav";
import ApiService from "../services/api";
import ActionModal from "../components/ActionModal";

export default function BorrowHistory() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "info" });
  const [renewRequests, setRenewRequests] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedRenew, setSelectedRenew] = useState(null);

  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const showToast = (message, variant = "info") => {
    const audio = new Audio(notificationSound);
    audio.play().catch(() => {});
    setToast({ show: true, message, variant });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa trả";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("user_id") || 1;
      try {
        const res = await ApiService.getBorrowRecordHistory(userId);
        const data = Array.isArray(res) ? res : [];
        setRecords(data);
        setFilteredRecords(data);
      } catch (err) {
        console.error("❌ API error:", err);
        showToast("❗ Không thể tải lịch sử mượn trả.", "danger");
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = [...records];
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => {
        const renewState = renewRequests[r.id];
        if (filterStatus === "returned") return r.end_time;
        if (filterStatus === "borrowing") return !r.end_time && r.status === "approved";
        if (filterStatus === "pending") return r.status === "pending";
        return true;
      });
    }
    if (filterDate) {
      filtered = filtered.filter((r) => r.start_time?.slice(0, 10) === filterDate);
    }
    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [filterStatus, filterDate, records, renewRequests]);

  const getStatus = (record) => {
    if (record.status === "pending") return "Chờ duyệt mượn";
    if (renewRequests[record.id] === "pending") return "Chờ duyệt gia hạn";
    if (record.end_time) return "Đã trả";
    return "Đang mượn";
  };

  const handleRenewClick = (record) => {
    setSelectedRenew(record);
    setShowRenewModal(true);
  };

  const handleConfirmRenew = async () => {
    try {
      setRenewRequests((prev) => ({ ...prev, [selectedRenew.id]: "pending" }));
      await ApiService.renewBorrowRecord(selectedRenew.id);
      showToast("✅ Gia hạn thành công. Phiếu đang chờ thủ thư duyệt.", "success");
    } catch (error) {
      let message = "❗ Gia hạn thất bại.";
      if (error?.response?.data?.message) {
        message = `❗ ${error.response.data.message}`;
      } else if (error?.message) {
        message = `❗ ${error.message}`;
      }
      showToast(message, "warning");
      setRenewRequests((prev) => {
        const updated = { ...prev };
        delete updated[selectedRenew.id];
        return updated;
      });
    }
    setShowRenewModal(false);
  };

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="container mt-5">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <h3 className="text-center mb-4 fw-bold">Lịch sử mượn trả sách</h3>

      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="returned">Đã trả</option>
            <option value="borrowing">Đang mượn</option>
            <option value="pending">Chờ duyệt</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-secondary w-100" onClick={() => { setFilterDate(""); setFilterStatus("all"); }}>
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {selectedRenew && (
        <ActionModal
          show={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          title="Xác nhận gia hạn sách"
          book={{ ...selectedRenew, image: selectedRenew.image || "https://via.placeholder.com/300x400?text=No+Image" }}
          readerName={localStorage.getItem("username") || "Bạn đọc"}
          createdAt={new Date()}
          dueDate={new Date(new Date(selectedRenew.due_time).setDate(new Date(selectedRenew.due_time).getDate() + 7))}
          onConfirm={handleConfirmRenew}
        />
      )}

      {filteredRecords.length === 0 ? (
        <div className="alert alert-info">
          {records.length === 0 ? "Bạn chưa mượn sách nào." : "Không có kết quả phù hợp với bộ lọc."}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Tên sách</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{indexOfFirstRecord + index + 1}</td>
                  <td>{record.title}</td>
                  <td>{formatDate(record.start_time)}</td>
                  <td>{formatDate(record.due_time)}</td>
                  <td>{formatDate(record.end_time)}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === "pending"
                          ? "bg-secondary"
                          : renewRequests[record.id] === "pending"
                          ? "bg-info text-dark"
                          : record.end_time
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {getStatus(record)}
                    </span>
                  </td>
                  <td>
                    {!record.end_time && record.status !== "pending" && !renewRequests[record.id] && (
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleRenewClick(record)}>
                        Gia hạn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-4 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                      Back
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
