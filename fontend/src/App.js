import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import BookList from "./components/BookList";
import Header from "./components/Header";
import Footer from "./components/Footer";

import {
  AdminDashboard,
  BookManagement,
  UsersManagement,
  CategoryManagement,
  AuthorManagement,
  BorrowManagement,
  StatisticsReport,
  BookCopyManagement,
  AdminActionHistory
} from "./pages";

import {
  Home, Search, BookDetail, FilteredBooksPage,
  Login, Register, ForgotPassword, ChangePassword,
  BorrowHistory, Profile
} from "./pages";

function AppContent() {
  const location = useLocation();

  const [auth, setAuth] = useState({
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    role: localStorage.getItem("role") || ""
  });

  useEffect(() => {
    const updateAuth = () => {
      setAuth({
        isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
        role: localStorage.getItem("role") || ""
      });
    };

    window.addEventListener("storage", updateAuth);
    window.addEventListener("authChanged", updateAuth); 

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChanged", updateAuth); 
    };
  }, []);


  const hideLayoutRoutes = [
    "/login", "/register", "/forgot-password", "/change-password",
    "/admin/bookmanagement", "/admin/usermanagement",
    "/admin/bookmanagement/category", "/admin/bookmanagement/author",
    "/admin/bookmanagement/publisher", "/admin/borrowManagement",
    "/admin/statisticsreport","/admin/history"
  ];
  const hideLayout = hideLayoutRoutes.includes(location.pathname) ||
  (
    location.pathname.startsWith("/admin/books/") &&
    location.pathname.endsWith("/copies")
  ) ||
  location.pathname.startsWith("/library-management");
  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Header />}
      <div className="flex-grow-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/category/:category" element={<FilteredBooksPage />} />

          {/* Auth */}
          <Route path="/login" element={!auth.isLoggedIn ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth.isLoggedIn ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={auth.isLoggedIn ? <ChangePassword /> : <Navigate to="/login" />} />
          <Route path="/profile" element={auth.isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/history" element={auth.isLoggedIn ? <BorrowHistory /> : <Navigate to="/login" />} />

          {/* Admin only */}
          <Route path="/library-management" element={auth.isLoggedIn && auth.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/history" element={auth.isLoggedIn && auth.role === "admin" ? <  AdminActionHistory /> : <Navigate to="/login" />} />
          <Route path="/admin/bookmanagement" element={auth.isLoggedIn && auth.role === "admin" ? <BookManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/books/:bookId/copies" element={auth.isLoggedIn && auth.role === "admin" ? <BookCopyManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/usermanagement" element={auth.isLoggedIn && auth.role === "admin" ? <UsersManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/bookmanagement/category" element={auth.isLoggedIn && auth.role === "admin" ? <CategoryManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/bookmanagement/author" element={auth.isLoggedIn && auth.role === "admin" ? <AuthorManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/borrowManagement" element={auth.isLoggedIn && auth.role === "admin" ? <BorrowManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/statisticsreport" element={auth.isLoggedIn && auth.role === "admin" ? <StatisticsReport /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
