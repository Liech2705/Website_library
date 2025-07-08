import { useState } from "react";
import { Link } from "react-router-dom";
import ToastMessage from "./ToastMessage";
import notificationSound from "../assets/thongbao.wav";
import axios from "axios";
import "./style.css";

export default function BookCard({ book }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
  console.log(isLoggedIn)
  const userId = isLoggedIn ? localStorage.getItem("user_id") : null;

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "info",
  });

  // Tính toán thông tin sách
  const authors = book.authors?.map((a) => a.name).join(", ") || "Không rõ";
  const publisher = book.publisher || "Không rõ";
  const borrowCount = book.borrowCount || 0;

  // 👉 Sửa logic: status !== 0 là còn sách
  const availableCopies = Array.isArray(book.book_copies)
    ? book.book_copies.filter((copy) => Number(copy.status) !== 0)
    : [];
  const isAvailable = availableCopies.length > 0;
  const availableCopy = availableCopies[0];

  const handleBorrow = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !userId) {
      setToast({
        show: true,
        message: "❗ Bạn phải đăng nhập để mượn sách.",
        variant: "warning",
      });
      new Audio(notificationSound).play().catch(() => {});
      return;
    }

    if (!isAvailable || !availableCopy?.id) {
      setToast({
        show: true,
        message: "❌ Không còn bản sao sách khả dụng.",
        variant: "danger",
      });
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/borrow-records", {
        user_id: userId,
        book_copy_id: availableCopy.id,
      });

      setToast({
        show: true,
        message: "✅ Yêu cầu mượn sách đã được gửi!",
        variant: "success",
      });
      new Audio(notificationSound).play().catch(() => {});
    } catch (error) {
      console.error("Lỗi mượn sách:", error.response?.data || error.message);
      setToast({
        show: true,
        message: "❌ Mượn sách thất bại. Vui lòng thử lại.",
        variant: "danger",
      });
    }
  };

  return (
    <>
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Link to={`/book/${book.id}`} className="text-decoration-none text-dark">
        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden book-card hover-shadow">
          {/* Ảnh bìa */}
          <div className="book-img-wrapper">
            <img
              src={book.image || "https://via.placeholder.com/150x220?text=No+Image"}
              alt={book.title}
              className="book-img"
            />
          </div>

          {/* Nội dung */}
          <div className="card-body bg-white d-flex flex-column">
            <h6 className="fw-semibold text-dark mb-2 text-truncate">{book.title}</h6>
            <div className="small text-muted mb-1 text-truncate">
              <i className="bi bi-person-fill me-1"></i>{authors}
            </div>
            <div className="small text-muted mb-1 text-truncate">
              <i className="bi bi-building me-1"></i>{publisher}
            </div>
            <div className="small text-muted mb-3">
              <i className="bi bi-journal-check me-1"></i>{borrowCount} lượt mượn
            </div>

            <button
              className={`btn btn-sm rounded-pill px-3 mt-auto ${
                isAvailable ? "btn-success" : "btn-outline-secondary"
              }`}
              onClick={isAvailable ? handleBorrow : undefined}
              disabled={!isAvailable}
            >
              {isAvailable ? "Mượn Sách" : "Hết Sách"}
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}
