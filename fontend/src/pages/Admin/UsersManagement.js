import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Toast, Spinner } from "react-bootstrap";
import { PencilFill, TrashFill, InfoCircleFill } from "react-bootstrap-icons";
import AdminSidebarLayout from "../../components/AdminSidebar";
import Pagination from "../../components/Pagination";
import "../style.css";
import ApiServiceAdmin from "../../services/admin/api";
import ApiService from "../../services/api";

export default function UsersManagement() {
  const [listUsers, setListUser] = useState([]);
  const [userInfors, setUserInfors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formUser, setFormUser] = useState({ name: "", email: "", infor: { school_name: "", phone: "", address: "" } });
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await ApiServiceAdmin.getUsers();
        setListUser(res);
      } catch (error) {
        setToastMsg("Lỗi khi tải người dùng!");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    listUsers.forEach(user => {
      if (!userInfors[user.id]) {
        ApiService.getUserInforById(user.id).then(infor => {
          setUserInfors(prev => ({ ...prev, [user.id]: infor }));
        });
      }
    });
  }, [listUsers]);

const filteredUsers = listUsers.filter((user) =>
  (user.name || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handlePageChange = (page) => setCurrentPage(page);

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Gọi API update user ở đây nếu có
        // await ApiServiceAdmin.updateUser(editingUser.id, formUser);
        setListUser(listUsers.map((u) => (u.id === editingUser.id ? { ...editingUser, ...formUser } : u)));
        setToastMsg("Cập nhật người dùng thành công!");
      } else {
        // Gọi API tạo user ở đây nếu có
        // const newUser = await ApiServiceAdmin.createUser(formUser);
        setListUser([
          ...listUsers,
          { id: listUsers.length + 1, role: 0, status: 1, lock_until: null, id_infor: 100 + listUsers.length + 1, ...formUser },
        ]);
        setToastMsg("Thêm người dùng thành công!");
      }
    } catch (error) {
      setToastMsg("Lỗi khi lưu người dùng!");
    }
    setShowModal(false);
    setShowToast(true);
    setFormUser({ name: "", email: "", infor: { school_name: "", phone: "", address: "" } });
    setEditingUser(null);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormUser({ ...user, infor: user.infor || { school_name: "", phone: "", address: "" } });
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      // Gọi API xóa user ở đây nếu có
      // await ApiServiceAdmin.deleteUser(deletingUserId);
      setListUser(listUsers.filter((u) => u.id !== deletingUserId));
      setToastMsg("Xóa người dùng thành công!");
    } catch (error) {
      setToastMsg("Lỗi khi xóa người dùng!");
    }
    setDeletingUserId(null);
    setShowToast(true);
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">👤 Quản lý người dùng</h4>
          <Button variant="primary" onClick={() => { setShowModal(true); setEditingUser(null); setFormUser({ name: "", email: "", infor: { school_name: "", phone: "", address: "" } }); }}>
            + Thêm người dùng
          </Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên người dùng..."
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="scrollable-table-wrapper">
            <Table striped bordered hover responsive className="mt-3">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Trường</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listUsers.map((user, index) => {
                  const infor = userInfors[user.id] || {};
                  return (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{infor.school_name || "—"}</td>
                      <td>{infor.phone || "—"}</td>
                      <td>{infor.address || "—"}</td>
                      <td>
                        <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEditClick(user)}>
                          <PencilFill />
                        </Button>
                        <Button variant="outline-info" size="sm">
                          <InfoCircleFill />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-3 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal thêm/sửa */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingUser ? "✏️ Sửa người dùng" : "👤 Thêm người dùng"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  value={formUser.name}
                  onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formUser.email}
                  onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Trường</Form.Label>
                <Form.Control
                  value={formUser.infor.school_name}
                  onChange={(e) => setFormUser({ ...formUser, infor: { ...formUser.infor, school_name: e.target.value } })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  value={formUser.infor.phone}
                  onChange={(e) => setFormUser({ ...formUser, infor: { ...formUser.infor, phone: e.target.value } })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  value={formUser.infor.address}
                  onChange={(e) => setFormUser({ ...formUser, infor: { ...formUser.infor, address: e.target.value } })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSaveUser}>
              {editingUser ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast thông báo */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          <Toast.Header>
            <strong className="me-auto">Thông báo</strong>
          </Toast.Header>
          <Toast.Body>
            ✅ {toastMsg}
          </Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}