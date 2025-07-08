// api 
import React, { useEffect, useState } from "react";
import ToastMessage from "../components/ToastMessage";
import notificationSound from "../assets/thongbao.wav";
import ApiService from "../services/api";

export default function BorrowHistory() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "info" });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = Array.isArray(filteredRecords)
    ? filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)
    : [];

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

  const showToast = (message, variant = "info") => {
    const audio = new Audio(notificationSound);
    audio.play().catch(() => {});
    setToast({ show: true, message, variant });
  };

  useEffect(() => {
    let filtered = [...records];

    if (filterStatus !== "all") {
      filtered = filtered.filter((r) =>
        filterStatus === "returned" ? r.end_time : !r.end_time
      );
    }

    if (filterDate) {
      filtered = filtered.filter((r) => r.start_time?.slice(0, 10) === filterDate);
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [filterStatus, filterDate, records]);

  const getStatus = (record) => (record.end_time ? "Đã trả" : "Đang mượn");

  const handleRenew = (bookId) => {
    const renewKey = `renewCount_${bookId}`;
    const currentCount = parseInt(localStorage.getItem(renewKey) || "0");

    if (currentCount >= 2) {
      showToast("❗ Bạn đã sử dụng hết số lần gia hạn.", "warning");
      return;
    }

    localStorage.setItem(renewKey, currentCount + 1);
    showToast("✅ Gia hạn thành công. Phiếu đã gửi thủ thư.", "success");
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
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setFilterDate("");
              setFilterStatus("all");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="alert alert-info">
          {records.length === 0
            ? "Bạn chưa mượn sách nào."
            : "Không có kết quả phù hợp với bộ lọc."}
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
                    <span className={`badge ${record.end_time ? "bg-success" : "bg-warning text-dark"}`}>
                      {getStatus(record)}
                    </span>
                  </td>
                  <td>
                    {!record.end_time && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleRenew(record.id)}
                      >
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
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
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



// import React, { useEffect, useState } from "react";
// import ToastMessage from "../components/ToastMessage";
// import notificationSound from "../assets/thongbao.wav";

// export default function BorrowHistory() {
//   const [records, setRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterTime, setFilterTime] = useState("all");
//   const [filterDate, setFilterDate] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", variant: "info" });

//   // ✅ Phân trang
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10 ;
//   const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "Chưa trả";
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("vi-VN");
//   };

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("isLoggedIn");
//     if (!isLoggedIn) {
//       showToast("❗ Vui lòng đăng nhập để xem lịch sử mượn trả.", "danger");
//       setTimeout(() => (window.location.href = "/login"), 1000);
//       return;
//     }

//     const mockData = [
//       { id: 1, title: "Dế mèn phiêu lưu ký", start_time: "2025-06-01", due_time: "2025-06-15", end_time: "2025-06-14" },
//       { id: 2, title: "Lập trình C cơ bản", start_time: "2025-06-20", due_time: "2025-07-04", end_time: null },
//       { id: 3, title: "Tư duy nhanh và chậm", start_time: "2025-04-10", due_time: "2025-04-24", end_time: "2025-04-23" },
//       { id: 4, title: "Đắc nhân tâm", start_time: "2025-05-02", due_time: "2025-05-16", end_time: "2025-05-16" },
//       { id: 5, title: "Lập trình Java nâng cao", start_time: "2025-07-01", due_time: "2025-07-15", end_time: null },
//       { id: 6, title: "Tôi thấy hoa vàng trên cỏ xanh", start_time: "2025-03-12", due_time: "2025-03-26", end_time: "2025-03-25" },
//       { id: 7, title: "Nhà giả kim", start_time: "2025-01-08", due_time: "2025-01-22", end_time: "2025-01-20" },
//       { id: 8, title: "Sống như người Nhật", start_time: "2025-06-15", due_time: "2025-06-29", end_time: null },
//       { id: 9, title: "Clean Code", start_time: "2025-07-01", due_time: "2025-07-14", end_time: null },
//       { id: 10, title: "Giết con chim nhại", start_time: "2025-02-18", due_time: "2025-03-03", end_time: "2025-03-01" },
//       { id: 11, title: "Những người khốn khổ", start_time: "2025-06-10", due_time: "2025-06-24", end_time: "2025-06-23" },
//     ];

//     setRecords(mockData);
//     setFilteredRecords(mockData);
//   }, []);

//   const showToast = (message, variant = "info") => {
//     const audio = new Audio(notificationSound);
//     audio.play().catch(() => {});
//     setToast({ show: true, message, variant });
//   };

//   useEffect(() => {
//     let filtered = [...records];

//     if (filterStatus !== "all") {
//       filtered = filtered.filter((r) =>
//         filterStatus === "returned" ? r.end_time : !r.end_time
//       );
//     }

//     if (filterTime !== "all" && !filterDate) {
//       const now = new Date();
//       filtered = filtered.filter((r) => {
//         const start = new Date(r.start_time);
//         if (filterTime === "month") {
//           return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
//         } else if (filterTime === "year") {
//           return start.getFullYear() === now.getFullYear();
//         }
//         return true;
//       });
//     }

//     if (filterDate) {
//       filtered = filtered.filter((r) => r.start_time === filterDate);
//     }

//     setFilteredRecords(filtered);
//     setCurrentPage(1); // reset về trang đầu mỗi khi lọc
//   }, [filterStatus, filterTime, filterDate, records]);

//   const getStatus = (record) => (record.end_time ? "Đã trả" : "Đang mượn");

//   const reservedBooks = [2, 8];

//   const handleRenew = (bookId) => {
//     const renewKey = `renewCount_${bookId}`;
//     const currentCount = parseInt(localStorage.getItem(renewKey) || "0");

//     if (currentCount >= 2) {
//       showToast("❗ Bạn đã sử dụng hết số lần gia hạn.", "warning");
//       return;
//     }

//     if (reservedBooks.includes(bookId)) {
//       showToast("❗ Sách đã được đặt trước, không thể gia hạn.", "danger");
//       return;
//     }

//     localStorage.setItem(renewKey, currentCount + 1);
//     showToast("✅ Gia hạn thành công. Phiếu đã gửi thủ thư.", "success");
//   };

//   return (
//     <div className="container mt-5">
//       <ToastMessage
//         show={toast.show}
//         message={toast.message}
//         variant={toast.variant}
//         onClose={() => setToast({ ...toast, show: false })}
//       />

//       <h3 className="text-center mb-4 fw-bold">Lịch sử mượn trả sách</h3>

//       <div className="row g-3 mb-3">
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="all">Tất cả trạng thái</option>
//             <option value="returned">Đã trả</option>
//             <option value="borrowing">Đang mượn</option>
//           </select>
//         </div>
//         <div className="col-md-3">
//           <input
//             type="date"
//             className="form-control"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//           />
//         </div>
//         <div className="col-md-3">
//           <button
//             className="btn btn-secondary w-100"
//             onClick={() => {
//               setFilterDate("");
//               setFilterStatus("all");
//               setFilterTime("all");
//             }}
//           >
//             Xóa bộ lọc
//           </button>
//         </div>
//       </div>

//       {filteredRecords.length === 0 ? (
//         <div className="alert alert-info">
//           {records.length === 0
//             ? "Bạn chưa mượn sách nào."
//             : "Không có kết quả phù hợp với bộ lọc."}
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>STT</th>
//                 <th>Tên sách</th>
//                 <th>Ngày mượn</th>
//                 <th>Hạn trả</th>
//                 <th>Ngày trả</th>
//                 <th>Trạng thái</th>
//                 <th>Hành động</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRecords.map((record, index) => (
//                 <tr key={record.id}>
//                   <td>{indexOfFirstRecord + index + 1}</td>
//                   <td>{record.title}</td>
//                   <td>{formatDate(record.start_time)}</td>
//                   <td>{formatDate(record.due_time)}</td>
//                   <td>{formatDate(record.end_time)}</td>
//                   <td>
//                     <span className={`badge ${record.end_time ? "bg-success" : "bg-warning text-dark"}`}>
//                       {getStatus(record)}
//                     </span>
//                   </td>
//                   <td>
//                     {!record.end_time && (
//                       <button
//                         className="btn btn-sm btn-outline-primary"
//                         onClick={() => handleRenew(record.id)}
//                       >
//                         Gia hạn
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* ✅ PHÂN TRANG */}
//           {totalPages > 1 && (
//             <div className="mt-4 d-flex justify-content-center">
//               <nav>
//                 <ul className="pagination">
//                   <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                     <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
//                       Back
//                     </button>
//                   </li>

//                   {[...Array(totalPages)].map((_, i) => (
//                     <li
//                       key={i}
//                       className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
//                     >
//                       <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
//                         {i + 1}
//                       </button>
//                     </li>
//                   ))}

//                   <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                     <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
//                       Next
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

