import React, { useState, useEffect } from "react";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";

export default function AdminActionHistory() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Giả lập dữ liệu log tương tác admin
    const mockLogs = [
      { id: 1, action: "Thêm sách 'Cấu trúc dữ liệu'", time: "2025-07-09 09:20:01" },
      { id: 2, action: "Xóa người dùng 'Nguyễn Văn A'", time: "2025-07-09 10:05:44" },
      { id: 3, action: "Duyệt phiếu mượn #102", time: "2025-07-09 11:22:15" },
      { id: 4, action: "Từ chối phiếu mượn #101", time: "2025-07-09 11:30:00" },
      { id: 5, action: "Cập nhật sách 'Tư duy nhanh và chậm'", time: "2025-07-10 08:15:30" },
      { id: 6, action: "Thêm tài khoản admin mới", time: "2025-07-10 09:45:00" },
      { id: 7, action: "Chỉnh sửa thông tin độc giả #45", time: "2025-07-10 10:10:22" },
    ];
    setLogs(mockLogs);
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="mb-4">📜 Lịch sử tương tác của Admin</h4>

        <div className="mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="🔍 Tìm theo nội dung thao tác..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="scrollable-table-wrapper">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nội dung thao tác</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.action}</td>
                  <td>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </AdminSidebarLayout>
  );
}
