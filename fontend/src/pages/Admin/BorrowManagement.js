import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { TrashFill, GearFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import ApiServiceAdmin from "../../services/admin/api";
import "../style.css";

export default function BorrowManagement() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState("borrowing");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    fetchRecords();
  }, []);

  const handleReturnBook = (id) => {
    alert(`Trả sách phiếu #${id}`);
  };

  // Lọc theo trạng thái (mượn/đã trả)
  const filteredByTab = borrowRecords.filter(
    (r) => r.returned === (selectedTab === "returned")
  );

  // Lọc theo từ khóa
  const filteredRecords = filteredByTab.filter((r) =>
    r.reader.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Button
              variant={selectedTab === "borrowing" ? "dark" : "outline-dark"}
              className="me-2"
              onClick={() => {
                setSelectedTab("borrowing");
                setCurrentPage(1);
              }}
            >
              Phiếu đang mượn
            </Button>
            <Button
              variant={selectedTab === "returned" ? "dark" : "outline-dark"}
              onClick={() => {
                setSelectedTab("returned");
                setCurrentPage(1);
              }}
            >
              Phiếu đã trả
            </Button>
          </div>
          <Button variant="success">+ Lập phiếu mượn</Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
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

        <div className="scrollable-table-wrapper">
          <table className="table table-striped table-bordered table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>Số phiếu</th>
                <th>Người tạo phiếu</th>
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
                  <td>{r.librarian}</td>
                  <td>{r.reader}</td>
                  <td>{r.bookTitle}</td>
                  <td>{r.quantity}</td>
                  <td>{new Date(r.borrowDate).toLocaleString()}</td>
                  <td>{new Date(r.dueDate).toLocaleString()}</td>
                  <td>{r.note}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" className="me-1">
                      <GearFill />
                    </Button>
                    <Button variant="outline-danger" size="sm" className="me-1">
                      <TrashFill />
                    </Button>
                    {selectedTab === "borrowing" && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleReturnBook(r.id)}
                      >
                        Trả sách
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
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
    </AdminSidebarLayout>
  );
}
