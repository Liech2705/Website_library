import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import AdminSidebarLayout from '../../components/AdminSidebar';
import ApiServiceAdmin from '../../services/admin/api';

export default function ReservationManagement() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const res = await ApiServiceAdmin.getReservations();
            setReservations(res);
        } catch (error) {
            alert('Lỗi khi tải danh sách đặt trước: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNotify = async (id) => {
        try {
            await ApiServiceAdmin.notifyBookAvailable(id);
            alert('Đã thông báo cho user thành công!');
            fetchReservations();
        } catch (error) {
            alert('Lỗi khi thông báo: ' + error.message);
        }
    };

    const handleCreateBorrow = async (id) => {
        try {
            await ApiServiceAdmin.createBorrowFromReservation(id);
            alert('Đã tạo phiếu mượn thành công!');
            fetchReservations();
        } catch (error) {
            alert('Lỗi khi tạo phiếu mượn: ' + error.message);
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

    const filteredByTab = reservations.filter((r) => r.status === selectedTab);
    const filteredReservations = filteredByTab.filter((r) =>
        r.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.book_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentReservations = filteredReservations.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => setCurrentPage(page);

    if (loading) {
        return (
            <AdminSidebarLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </AdminSidebarLayout>
        );
    }

    return (
        <AdminSidebarLayout>
            <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="mb-4">Quản lý đặt trước sách</h3>

                {/* Tabs */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                    <div className="mb-2 mb-md-0">
                        {['pending', 'notified', 'expired'].map((tab) => (
                            <Button
                                key={tab}
                                variant={selectedTab === tab ? "dark" : "outline-dark"}
                                className="me-1 me-md-2 mb-1"
                                size="sm"
                                onClick={() => {
                                    setSelectedTab(tab);
                                    setCurrentPage(1);
                                }}
                            >
                                {tab === 'pending' ? 'Chờ sách' :
                                    tab === 'notified' ? 'Đã thông báo' : 'Hết hạn'}
                            </Button>
                        ))}
                    </div>
                    <div className="w-100 w-md-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo tên user hoặc sách..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredReservations.length === 0 ? (
                    <div className="alert alert-info">
                        Không có đặt trước nào trong trạng thái này.
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <Table striped bordered hover className="table-sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th className="d-none d-md-table-cell">STT</th>
                                        <th>User</th>
                                        <th>Sách</th>
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
                                                <div className="fw-bold">{reservation.user_name}</div>
                                                <div className="d-md-none small text-muted">
                                                    {getStatusBadge(reservation.status)} | {getBookStatusBadge(reservation.book_status)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold">{reservation.book_title}</div>
                                                <div className="d-md-none small text-muted">
                                                    Đặt: {formatDate(reservation.created_at)}
                                                </div>
                                            </td>
                                            <td className="d-none d-lg-table-cell">{getStatusBadge(reservation.status)}</td>
                                            <td className="d-none d-lg-table-cell">{getBookStatusBadge(reservation.book_status)}</td>
                                            <td className="d-none d-md-table-cell">{formatDate(reservation.created_at)}</td>
                                            <td className="d-none d-lg-table-cell">{formatDate(reservation.expire_time)}</td>
                                            <td>
                                                {reservation.status === 'pending' && reservation.book_status.includes('Có sẵn') && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        className="w-100 w-md-auto"
                                                        onClick={() => handleNotify(reservation.id)}
                                                    >
                                                        <span className="d-none d-md-inline">Thông báo có sách</span>
                                                        <span className="d-md-none">Thông báo</span>
                                                    </Button>
                                                )}
                                                {reservation.status === 'notified' && reservation.book_status.includes('Có sẵn') && (
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="w-100 w-md-auto mt-1"
                                                        onClick={() => handleCreateBorrow(reservation.id)}
                                                    >
                                                        <span className="d-none d-md-inline">Tạo phiếu mượn</span>
                                                        <span className="d-md-none">Mượn</span>
                                                    </Button>
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
        </AdminSidebarLayout>
    );
} 