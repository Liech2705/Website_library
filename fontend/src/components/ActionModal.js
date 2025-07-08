import { Modal, Button } from "react-bootstrap";

export default function ActionModal({
  show,
  onClose,
  title,
  book,
  readerName,
  createdAt,
  dueDate,
  onConfirm,
}) {
  const formatDate = (d) =>
    d instanceof Date ? d.toLocaleDateString("vi-VN") : "Không xác định";

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-3">
          <img
            src={book.image || "https://via.placeholder.com/120x160?text=No+Image"}
            alt={book.title}
            style={{ width: "100px", height: "140px", objectFit: "cover" }}
            className="border rounded"
          />
          <div className="flex-grow-1 small">
            <p><strong>Số phiếu:</strong> Tự động</p>
            <p><strong>Tên độc giả:</strong> {readerName || "Bạn đọc"}</p>
            <p><strong>Tên sách:</strong> {book.title}</p>
            <p><strong>Nhà xuất bản:</strong> {book.publisher || "Không rõ"}</p>
            <p><strong>Ngày tạo phiếu:</strong> {formatDate(createdAt)}</p>
            {dueDate && (
              <p><strong>Hạn trả:</strong> {formatDate(dueDate)}</p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="success" onClick={onConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
