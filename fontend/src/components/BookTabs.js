// src/components/BookTabs.js
import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <Nav variant="tabs" activeKey={currentPath} className="mb-3">
      <Nav.Item>
        <Nav.Link eventKey="/admin/bookmanagement" onClick={() => navigate("/admin/bookmanagement")}>
          📘 Sách
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/admin/bookmanagement/category" onClick={() => navigate("/admin/bookmanagement/category")}>
          🗂️ Thể loại
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/admin/bookmanagement/author" onClick={() => navigate("/admin/bookmanagement/author")}>
          ✍️ Tác giả
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/admin/bookmanagement/publisher" onClick={() => navigate("/admin/bookmanagement/publisher")}>
          🏢 Nhà xuất bản
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
