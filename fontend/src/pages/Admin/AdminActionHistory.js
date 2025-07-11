import React, { useState, useEffect } from "react";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";
import ApiServiceAdmin from "../../services/admin/api";
import { useLocation } from "react-router-dom";

export default function AdminActionHistory() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let res;
        const params = new URLSearchParams(location.search);
        const adminId = params.get('adminId');
        if (adminId) {
          res = await ApiServiceAdmin.getAdminActivitiesByAdminId(adminId);
        } else {
          res = await ApiServiceAdmin.getAdminActivities();
        }
        setLogs(res.data || res);
      } catch (err) {
        setLogs([]);
      }
    };
    fetchLogs();
  }, [location.search]);

  const filteredLogs = logs.filter((log) =>
    (log.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                  <td>{log.description}</td>
                  <td>{log.created_at}</td>
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
