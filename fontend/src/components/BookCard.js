import { useState } from "react";
import { Link } from "react-router-dom";
import ToastMessage from "./ToastMessage";
import notificationSound from "../assets/thongbao.wav";
import axios from "axios";
import ActionModal from "../components/ActionModal.js"; // ➕ Thêm modal
import "./style.css";
import ApiService from "../services/api.js";

export default function BookCard({ book }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userId = isLoggedIn ? localStorage.getItem("user_id") : null; // ✅ giữ nguyên theo trang 1

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "info",
  });

  const [showModal, setShowModal] = useState(false); // ➕ modal toggle

  const authors = book.authors?.map((a) => a.name).join(", ") || "Không rõ";
  const publisher = book.publisher || "Không rõ";
  const borrowCount = book.borrowCount || 0;

  const availableCopies = Array.isArray(book.book_copies)
    ? book.book_copies.filter((copy) => Number(copy.status) !== 0)
    : [];
  const isAvailable = availableCopies.length > 0;
  const availableCopy = availableCopies[0];

  const now = new Date();
  const due = new Date();
  due.setDate(now.getDate() + 14);
  const readerName = localStorage.getItem("username") || "Bạn đọc";

  const handleBorrow = async () => {
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
      const data = {
        user_id : userId,
        id_bookcopy: availableCopy.id,
      }
      await ApiService.createBorrowRecord(data);
      setToast({
        show: true,
        message: "✅ Yêu cầu mượn sách đã được gửi!",
        variant: "success",
      });
      new Audio(notificationSound).play().catch(() => {});
    } catch (error) {
      console.error("Lỗi mượn sách:", error.message || error.response?.data);
      setToast({
        show: true,
        message: "❌ " + error.message,
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

      {/* ➕ Modal xác nhận mượn sách */}
      <ActionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Xác nhận mượn sách"
        book={book}
        readerName={readerName}
        createdAt={now}
        dueDate={due}
        onConfirm={() => {
          setShowModal(false);
          handleBorrow();
        }}
      />

      <Link to={`/book/${book.id}`} className="text-decoration-none text-dark">
        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden book-card hover-shadow">
          <div className="book-img-wrapper">
            <img
              src={book.image || "https://via.placeholder.com/150x220?text=No+Image"}
              alt={book.title}
              className="book-img"
            />
          </div>

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
              className={`btn btn-sm rounded-pill px-3 mt-auto ${isAvailable ? "btn-success" : "btn-outline-secondary"}`}
              onClick={(e) => {
                e.preventDefault();
                if (isAvailable) setShowModal(true); // 👉 mở modal thay vì mượn trực tiếp
              }}
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
