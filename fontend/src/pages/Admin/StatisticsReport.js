import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";

// Dữ liệu mẫu
const allBooks = [
  {
    id: 1,
    title: "Cây Cam Ngọt",
    author: "Tô Hoài",
    quantity: 6,
    monthlyData: { 6: 45, 7: 10, 10: 2 },
  },
  {
    id: 2,
    title: "Lược Sử Loài Người",
    author: "Harari",
    quantity: 20,
    monthlyData: { 6: 20, 7: 15 },
  },
  {
    id: 3,
    title: "Mắt Biếc",
    author: "Nguyễn Nhật Ánh",
    quantity: 5,
    monthlyData: { 6: 8, 10: 1 },
  },
  {
    id: 4,
    title: "Dế Mèn Phiêu Lưu Ký",
    author: "Tô Hoài",
    quantity: 15,
    monthlyData: { 6: 1 },
  },
  {
    id: 5,
    title: "Bí Mật Của Hoa Vàng",
    author: "Osho",
    quantity: 8,
    monthlyData: { 6: 30, 7: 5 },
  },
];

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState("popular");
  const [fromMonth, setFromMonth] = useState(1);
  const [toMonth, setToMonth] = useState(10);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const handleStatistic = () => {
    const newData = [];
    for (let month = fromMonth; month <= toMonth; month++) {
      let totalBorrowed = 0;
      allBooks.forEach((b) => {
        totalBorrowed += b.monthlyData[month] || 0;
      });
      newData.push({
        month: `Tháng ${month}`,
        borrowed: totalBorrowed,
      });
    }
    setFilteredChartData(newData);
  };

  const renderChart = () => (
    <div className="mb-4">
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-end">
        <div>
          <label>Từ tháng</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={12}
            value={fromMonth}
            onChange={(e) => setFromMonth(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Đến tháng</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={12}
            value={toMonth}
            onChange={(e) => setToMonth(Number(e.target.value))}
          />
        </div>
        <Button variant="success" onClick={handleStatistic}>
          📊 Thống kê
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={filteredChartData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="borrowed" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTableData = () => {
    if (activeTab === "statistic") return null;

    let data = [];
    if (activeTab === "popular") {
      data = allBooks.filter((b) => {
        const total = Object.values(b.monthlyData).reduce((sum, val) => sum + val, 0);
        return total > 10;
      });
    } else if (activeTab === "lowstock") {
      data = allBooks.filter((b) => b.quantity < 10);
    } else {
      data = allBooks;
    }

    const totalPages = Math.ceil(data.length / booksPerPage);
    const indexOfLast = currentPage * booksPerPage;
    const indexOfFirst = indexOfLast - booksPerPage;
    const currentBooks = data.slice(indexOfFirst, indexOfLast);

    return (
      <>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Số lượng</th>
              <th>Tổng số lượt mượn</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((b) => {
              const totalBorrowed = Object.values(b.monthlyData).reduce((sum, val) => sum + val, 0);
              return (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.quantity}</td>
                  <td>{totalBorrowed}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="fw-bold mb-3">📊 Báo cáo - Thống kê</h4>

        <div className="mb-4 d-flex gap-2 flex-wrap">
          <Button
            variant={activeTab === "popular" ? "dark" : "outline-dark"}
            onClick={() => {
              setActiveTab("popular");
              setCurrentPage(1);
            }}
          >
            📚 Sách được mượn nhiều
          </Button>
          <Button
            variant={activeTab === "lowstock" ? "dark" : "outline-dark"}
            onClick={() => {
              setActiveTab("lowstock");
              setCurrentPage(1);
            }}
          >
            ⚠️ Sách có SL &lt; 10
          </Button>
          <Button
            variant={activeTab === "all" ? "dark" : "outline-dark"}
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            📦 Tất cả sách
          </Button>
          <Button
            variant={activeTab === "statistic" ? "dark" : "outline-dark"}
            onClick={() => {
              setActiveTab("statistic");
              handleStatistic();
            }}
          >
            📅 Thống kê sách mượn
          </Button>
        </div>

        {activeTab === "statistic" ? renderChart() : renderTableData()}
      </div>
    </AdminSidebarLayout>
  );
}