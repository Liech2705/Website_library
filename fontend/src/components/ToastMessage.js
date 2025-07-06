import React, { useEffect, useState } from "react";
import notificationSound from "../assets/thongbao.wav"; // 👈 thêm file âm thanh vào thư mục assets

export default function ToastMessage({ show, message, variant = "info", onClose }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);

      // 🔊 Phát âm thanh khi toast xuất hiện
      const audio = new Audio(notificationSound);
      audio.play().catch((e) => {
        // tránh lỗi nếu trình duyệt chặn autoplay
        console.warn("Cannot play sound:", e);
      });

      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`toast align-items-center text-white bg-${variant} position-fixed top-0 end-0 m-4 show`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 9999, minWidth: "300px" }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
        />
      </div>
    </div>
  );
}
