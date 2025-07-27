import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Toast,
  Spinner,
  InputGroup,
  Tabs,
  Tab,
} from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
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
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    infor: { school_name: "", phone: "", address: "" },
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState("active");

  const itemsPerPage = 10;

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
    listUsers.forEach((user) => {
      if (!userInfors[user.id]) {
        ApiService.getUserInforById(user.id).then((infor) => {
          setUserInfors((prev) => ({ ...prev, [user.id]: infor }));
        });
      }
    });
  }, [listUsers]);

  const isUserLocked = (user) =>
    user.lock_until && new Date(user.lock_until) > new Date();

  const filteredUsers = listUsers.filter((user) =>
    (user.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedUsers = filteredUsers.filter((user) =>
    selectedTab === "active" ? !isUserLocked(user) : isUserLocked(user)
  );

  const totalPages = Math.ceil(displayedUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = displayedUsers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await ApiServiceAdmin.updateUser(editingUser.id, formUser);
        const res = await ApiServiceAdmin.getUsers();
        setListUser(res);
        setToastMsg("Cập nhật người dùng thành công!");
      } else {
      const created = await ApiServiceAdmin.addUser(formUser); 
      if (created) {
        const res = await ApiServiceAdmin.getUsers();
        setListUser(res);
        setToastMsg("Thêm người dùng thành công!");
      }
        }
    } catch (error) {
      setToastMsg("Lỗi khi lưu người dùng!");
    }
    setShowModal(false);
    setShowToast(true);
    setFormUser({
      name: "",
      email: "",
      password: "",
      infor: { school_name: "", phone: "", address: "" },
    });
    setEditingUser(null);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormUser({
      ...user,
      password: "",
      infor: user.infor || {
        school_name: "",
        phone: "",
        address: "",
      },
    });
    setShowModal(true);
  };

  const handleToggleLock = async (user) => {
    try {
      const isLocked = isUserLocked(user);
      const updatedUser = {
        ...user,
        lock_until: isLocked
          ? null
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await ApiServiceAdmin.updateUser(user.id, updatedUser);
      const res = await ApiServiceAdmin.getUsers();
      setListUser(res);
      setToastMsg(isLocked ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản!");
      setShowToast(true);
    } catch (err) {
      setToastMsg("Lỗi khi cập nhật trạng thái!");
      setShowToast(true);
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">👤 Quản lý người dùng</h4>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              setEditingUser(null);
              setFormUser({
                name: "",
                email: "",
                password: "",
                infor: { school_name: "", phone: "", address: "" },
              });
            }}
          >
            + Thêm người dùng
          </Button>
        </div>

         <Tabs
          activeKey={selectedTab}
          onSelect={(k) => {
            setSelectedTab(k);
            setCurrentPage(1);
          }}
          className="mb-3"
        >
          <Tab eventKey="active" title="Tài khoản đang hoạt động" />
          <Tab eventKey="locked" title="Tài khoản bị khóa" />
        </Tabs>

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
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => {
                  const infor = userInfors[user.id] || {};
                  const isLocked = isUserLocked(user);
                  return (
                    <tr key={user.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{infor.school_name || "—"}</td>
                      <td>{infor.phone || "—"}</td>
                      <td>{infor.address || "—"}</td>
                      <td>
                        <span
                          className={`badge ${
                            isLocked ? "bg-secondary" : "bg-success"
                          }`}
                        >
                          {isLocked ? "Bị khóa" : "Đang hoạt động"}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant={isLocked ? "outline-success" : "outline-danger"}
                          size="sm"
                          onClick={() => handleToggleLock(user)}
                        >
                          {isLocked ? "Mở khóa" : "Khóa"}
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

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? "✏️ Sửa người dùng" : "👤 Thêm người dùng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  value={formUser.name}
                  onChange={(e) =>
                    setFormUser({ ...formUser, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formUser.email}
                  onChange={(e) =>
                    setFormUser({ ...formUser, email: e.target.value })
                  }
                />
              </Form.Group>
              {!editingUser && (
                <Form.Group className="mb-2">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={formUser.password}
                      onChange={(e) =>
                        setFormUser({ ...formUser, password: e.target.value })
                      }
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              )}
              <Form.Group className="mb-2">
                <Form.Label>Trường</Form.Label>
                <Form.Control
                  value={formUser.infor.school_name}
                  onChange={(e) =>
                    setFormUser({
                      ...formUser,
                      infor: { ...formUser.infor, school_name: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  value={formUser.infor.phone}
                  onChange={(e) =>
                    setFormUser({
                      ...formUser,
                      infor: { ...formUser.infor, phone: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  value={formUser.infor.address}
                  onChange={(e) =>
                    setFormUser({
                      ...formUser,
                      infor: { ...formUser.infor, address: e.target.value },
                    })
                  }
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
          <Toast.Body>✅ {toastMsg}</Toast.Body>
        </Toast>
      </div>
    </AdminSidebarLayout>
  );
}
