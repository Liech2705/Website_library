import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ApiService from "../services/api";
import ToastMessage from "../components/ToastMessage";
import ActionModal from "../components/ActionModal";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", variant: "info" });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("borrow");
  const [relatedBooks, setRelatedBooks] = useState([]);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userId = localStorage.getItem("user_id");
  const readerName = localStorage.getItem("username") || "Bạn đọc";

  const now = new Date();
  const due = new Date();
  due.setDate(now.getDate() + 14);

  const showToast = (message, variant = "info") => {
    setToast({ show: true, message, variant });
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await ApiService.getBookById(id);
        setBook(res);
      } catch (err) {
        console.error("Lỗi khi tải sách:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        const all = await ApiService.getBooks();
        const related = all.filter(
          b =>
            b.id !== parseInt(id) &&
            (
              b.category?.name === book?.category?.name ||
              b.authors?.some(a => book.authors?.map(x => x.name).includes(a.name))
            )
        );
        setRelatedBooks(related.slice(0, 6));
      } catch (err) {
        console.error("Lỗi khi lấy sách liên quan:", err);
      }
    };
    if (book) fetchRelatedBooks();
  }, [book, id]);

  const availableCopies = book?.book_copies?.filter(copy =>
    copy.status !== 0 && copy.status !== "0"
  ) || [];
  const availableCount = availableCopies.length;
  const isAvailable = availableCount > 0;
  const availableCopy = availableCopies[0];

  const authors = book?.authors?.map(a => a.name).join(", ") || "Không rõ";
  const category = book?.category?.name || "Chưa phân loại";

  const fullImage = book?.image_url?.startsWith("http")
    ? book.image_url
    : book?.image_url;

  const handleConfirm = async () => {
    if (!isLoggedIn || !userId) {
      showToast("❗ Bạn cần đăng nhập.", "danger");
      return;
    }

    if (!availableCopy && modalType === "borrow") {
      showToast("📕 Không tìm thấy bản sao còn sẵn để mượn.", "warning");
      return;
    }

    try {
      if (modalType === "borrow") {
        await ApiService.createBorrowRecord({
          user_id: userId,
          book_copy_id: availableCopy?.id,
        });
        showToast("✅ Đã gửi yêu cầu mượn sách!", "success");
      } else {
        await ApiService.createReservation({
          user_id: userId,
          book_id: book?.id,
        });
        showToast("✅ Đã gửi yêu cầu đặt trước!", "success");
      }
    } catch (err) {
      console.error("Lỗi xử lý:", err);
      showToast("❌ " + err.message, "danger");
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center">⏳ Đang tải sách...</div>;
  }

  if (!book) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">📕 Không tìm thấy sách</h2>
        <Link to="/" className="btn btn-outline-primary mt-3">← Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 position-relative">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <ActionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "borrow" ? "Phiếu mượn sách" : "Phiếu đặt trước"}
        book={{ ...book, image: fullImage }}
        readerName={readerName}
        createdAt={now}
        dueDate={modalType === "borrow" ? due : null}
        onConfirm={handleConfirm}
      />

      {/* Phần chi tiết sách */}
      <div className="row align-items-center">
        <div className="col-md-4 mb-4">
          <img
            src={fullImage || "https://via.placeholder.com/300x400?text=No+Image"}
            alt={book.title}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-8">
          <h2 className="fw-bold text-primary mb-3">{book.title}</h2>
          <ul className="list-unstyled text-muted fs-6">
            <li><strong>Mã sách:</strong> {book.id}</li>
            <li><strong>Tác giả:</strong> <span className="text-success">{authors}</span></li>
            <li><strong>Thể loại:</strong> {category}</li>
            <li><strong>NXB:</strong> {book.publisher || "?"}</li>
            <li><strong>Năm:</strong> {book.year || "?"}</li>
            <li><strong>Lượt xem:</strong> {book.views || 0}</li>
            <li><strong>Số lượng còn:</strong> {availableCount}</li>
          </ul>

          <div className="mt-4">
            {isAvailable ? (
              <>
                <div className="alert alert-success mb-3">✅ Sách hiện có sẵn.</div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setModalType("borrow");
                    setShowModal(true);
                  }}
                >
                  Mượn Sách Ngay
                </button>
              </>
            ) : (
              <>
                <div className="alert alert-warning mb-3">⚠️ Sách đã hết. Bạn có thể đặt trước.</div>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    setModalType("reserve");
                    setShowModal(true);
                  }}
                >
                  Đặt Trước
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mô tả sách */}
      <div className="mt-5 pt-4 border-top">
        <h5 className="text-muted mb-3">Giới Thiệu Sách</h5>
        <h6 className="text-danger">{book.title?.toUpperCase()}</h6>
        {book.description ? (
          <p style={{ textAlign: "justify", whiteSpace: "pre-line" }}>{book.description}</p>
        ) : (
          <div className="text-muted fst-italic">Chưa có mô tả cho cuốn sách này.</div>
        )}
      </div>

      {/* Sách gợi ý */}
      {relatedBooks.length > 0 && (
        <div className="mt-5">
          <h5 className="text-muted mb-3">📘 Gợi ý sách cùng thể loại / tác giả</h5>
          <div className="row">
            {relatedBooks.map(rb => {
              const img = rb.image_url?.startsWith("http")
                ? rb.image_url
                : `http://127.0.0.1:8000${rb.image_url || ""}`;

              return (
                <div key={rb.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={img || "https://via.placeholder.com/300x400?text=No+Image"}
                      className="card-img-top"
                      alt={rb.title}
                      style={{ height: "280px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h6 className="card-title text-primary">{rb.title}</h6>
                      <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
                        {rb.authors?.map(a => a.name).join(", ") || "Không rõ tác giả"}
                      </p>
                      <Link to={`/book/${rb.id}`} className="btn btn-sm btn-outline-dark">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link to="/" className="btn btn-outline-dark">← Quay lại danh sách</Link>
      </div>
    </div>
  );
}
