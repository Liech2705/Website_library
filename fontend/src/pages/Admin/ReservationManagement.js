import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import AdminSidebarLayout from '../../components/AdminSidebar';
import ApiServiceAdmin from '../../services/admin/api';
import ToastMessage from '../../components/ToastMessage';
import notificationSound from '../../assets/thongbao.wav';
import Pagination from '../../components/Pagination';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [toast, setToast] = useState({ show: false, message: '', variant: 'info' });

  const showToast = (message, variant = 'info') => {
    try {
      const audio = new Audio(notificationSound);
      audio.play().catch(() => {});
    } catch {}
    setToast({ show: true, message, variant });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await ApiServiceAdmin.getReservations();
      setReservations(res);
    } catch (error) {
      showToast('❗ Lỗi khi tải danh sách đặt trước: ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async (id) => {
    try {
      await ApiServiceAdmin.notifyBookAvailable(id);
      showToast('✅ Đã thông báo cho user thành công!', 'success');
      fetchReservations();
    } catch (error) {
      showToast('❗ Lỗi khi thông báo: ' + error.message, 'danger');
    }
  };

  const handleCreateBorrow = async (id) => {
    try {
      await ApiServiceAdmin.createBorrowFromReservation(id);
      showToast('✅ Đã tạo phiếu mượn thành công!', 'success');
      fetchReservations();
    } catch (error) {
      showToast('❗ Lỗi khi tạo phiếu mượn: ' + error.message, 'danger');
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
  const filteredReservations = filteredByTab.filter(
    (r) =>
      r.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.book_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <AdminSidebarLayout>
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="mb-4">Quản lý đặt trước sách</h3>

          {/* Tabs & Search */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              {['pending', 'notified', 'expired'].map((tab) => (
                <Button
                  key={tab}
                  variant={selectedTab === tab ? 'dark' : 'outline-dark'}
                  className="me-2 mb-1"
                  size="sm"
                  onClick={() => {
                    setSelectedTab(tab);
                    setCurrentPage(1);
                  }}
                >
                  {tab === 'pending'
                    ? 'Chờ sách'
                    : tab === 'notified'
                    ? 'Đã thông báo'
                    : 'Hết hạn'}
                </Button>
              ))}
            </div>
            <div>
              <input
                type="text"
                className="form-control form-control-sm w-auto"
                placeholder="🔍 Tên user hoặc sách..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <div className="spinner-border" role="status" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="alert alert-info">Không có đặt trước nào trong trạng thái này.</div>
          ) : (
            <>
              <div className="scrollable-table-wrapper">
                <Table striped bordered hover className="table-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>STT</th>
                      <th>Người đặt</th>
                      <th>Sách</th>
                      <th>Trạng thái đặt</th>
                      <th>Trạng thái sách</th>
                      <th>Ngày đặt</th>
                      <th>Hạn thông báo</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReservations.map((r, index) => (
                      <tr key={r.id}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{r.user_name}</td>
                        <td>{r.book_title}</td>
                        <td>{getStatusBadge(r.status)}</td>
                        <td>{getBookStatusBadge(r.book_status)}</td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>{formatDate(r.expire_time)}</td>
                        <td>
                          {r.status === 'pending' && r.book_status.includes('Có sẵn') && (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleNotify(r.id)}
                            >
                              Thông báo
                            </Button>
                          )}
                          {r.status === 'notified' && r.book_status.includes('Có sẵn') && (
                            <Button
                              size="sm"
                              variant="success"
                              className="mt-1"
                              onClick={() => handleCreateBorrow(r.id)}
                            >
                              Mượn
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
                <div className="mt-3 d-flex justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </AdminSidebarLayout>
    </>
  );
}
