import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, Alert } from 'react-bootstrap';
import ApiService from '../services/api';
import ToastMessage from '../components/ToastMessage';
import notificationSound from '../assets/thongbao.wav';

export default function ReservationHistory() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", variant: "info" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchReservations();
    }, []);

    const showToast = (message, variant = "info") => {
        const audio = new Audio(notificationSound);
        audio.play().catch(() => { });
        setToast({ show: true, message, variant });
    };

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const res = await ApiService.getUserReservations();
            setReservations(res);
        } catch (error) {
            showToast("❗ Không thể tải lịch sử đặt trước.", "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (id) => {
        if (window.confirm('Bạn có chắc muốn hủy đặt trước này?')) {
            try {
                await ApiService.cancelReservation(id);
                showToast("✅ Hủy đặt trước thành công!", "success");
                fetchReservations();
            } catch (error) {
                showToast("❗ Lỗi khi hủy đặt trước: " + error.message, "danger");
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge bg="warning" text="dark">Chờ sách</Badge>;
            case 'notified':
                return <Badge bg="info" text="dark">Đã thông báo</Badge>;
            case 'expired':
                return <Badge bg="secondary">Hết hạn</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const getBookStatusBadge = (bookStatus) => {
        if (bookStatus.includes('Có sẵn')) {
            return <Badge bg="success">{bookStatus}</Badge>;
        } else if (bookStatus.includes('Đang mượn')) {
            return <Badge bg="primary">{bookStatus}</Badge>;
        } else if (bookStatus.includes('Chờ duyệt')) {
            return <Badge bg="warning" text="dark">{bookStatus}</Badge>;
        } else if (bookStatus.includes('Hết sách')) {
            return <Badge bg="danger">{bookStatus}</Badge>;
        } else {
            return <Badge bg="secondary">{bookStatus}</Badge>;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const totalPages = Math.ceil(reservations.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentReservations = reservations.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => setCurrentPage(page);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <ToastMessage
                show={toast.show}
                message={toast.message}
                variant={toast.variant}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <h3 className="text-center mb-4 fw-bold">Lịch sử đặt trước sách</h3>

            {reservations.length === 0 ? (
                <Alert variant="info">
                    Bạn chưa đặt trước sách nào.
                </Alert>
            ) : (
                <>
                    <div className="table-responsive">
                        <Table striped bordered hover className="table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th className="d-none d-md-table-cell">STT</th>
                                    <th>Tên sách</th>
                                    <th className="d-none d-lg-table-cell">Trạng thái đặt trước</th>
                                    <th className="d-none d-lg-table-cell">Trạng thái sách</th>
                                    <th className="d-none d-md-table-cell">Ngày đặt</th>
                                    <th className="d-none d-lg-table-cell">Hạn thông báo</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReservations.map((reservation, index) => (
                                    <tr key={reservation.id}>
                                        <td className="d-none d-md-table-cell">{indexOfFirst + index + 1}</td>
                                        <td>
                                            <div className="fw-bold">{reservation.book_title}</div>
                                            <div className="d-lg-none small text-muted">
                                                {getStatusBadge(reservation.status)} | {getBookStatusBadge(reservation.book_status)}
                                            </div>
                                        </td>
                                        <td className="d-none d-lg-table-cell">{getStatusBadge(reservation.status)}</td>
                                        <td className="d-none d-lg-table-cell">{getBookStatusBadge(reservation.book_status)}</td>
                                        <td className="d-none d-md-table-cell">{formatDate(reservation.created_at)}</td>
                                        <td className="d-none d-lg-table-cell">{formatDate(reservation.expire_time)}</td>
                                        <td>
                                            {reservation.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    className="w-100 w-md-auto"
                                                    onClick={() => handleCancelReservation(reservation.id)}
                                                >
                                                    <span className="d-none d-md-inline">Hủy đặt trước</span>
                                                    <span className="d-md-none">Hủy</span>
                                                </Button>
                                            )}
                                            {reservation.status === 'notified' && (
                                                <Alert variant="info" className="mb-0 py-1">
                                                    <small>Sách đã có sẵn! Vui lòng đến thư viện trong vòng 24h.</small>
                                                </Alert>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <nav>
                                <ul className="pagination pagination-sm">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                            <span className="d-none d-sm-inline">Trước</span>
                                            <span className="d-sm-none">‹</span>
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => {
                                        // Chỉ hiển thị một số trang trên mobile
                                        if (window.innerWidth < 768) {
                                            if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                                                return (
                                                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                );
                                            } else if (i === currentPage - 2 || i === currentPage + 2) {
                                                return <li key={i} className="page-item disabled"><span className="page-link">...</span></li>;
                                            }
                                            return null;
                                        } else {
                                            return (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            );
                                        }
                                    })}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                            <span className="d-none d-sm-inline">Sau</span>
                                            <span className="d-sm-none">›</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 