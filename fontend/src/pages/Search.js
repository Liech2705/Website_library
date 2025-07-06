import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function SearchPage() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword")?.toLowerCase() || "";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API mỗi khi từ khóa thay đổi
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/reviews_books")
      .then((res) => {
        setBooks(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sách:", err);
        setBooks([]);
        setLoading(false);
      });
  }, [keyword]);

  const filteredBooks = books.filter(({ title, year, authors, category }) => {
    const titleMatch = (title || "").toLowerCase().includes(keyword);
    const yearMatch = String(year || "").includes(keyword);
    const authorNames = (authors || []).map(a => a.name).join(", ");
    const authorMatch = authorNames.toLowerCase().includes(keyword);
    const categoryName = typeof category === "string" ? category : (category?.name || "");
    const categoryMatch = categoryName.toLowerCase().includes(keyword);

    return titleMatch || yearMatch || authorMatch || categoryMatch;
  });

  return (
    <div className="container py-4 min-vh-100">
      <h2 className="mb-4 text-center">
        Kết quả tìm kiếm: <em>"{keyword}"</em>
      </h2>

      {loading ? (
        <div className="text-center">⏳ Đang tải dữ liệu...</div>
      ) : filteredBooks.length === 0 ? (
        <div className="alert alert-warning text-center">
          ❌ Không tìm thấy quyển sách nào phù hợp.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center">
          {filteredBooks.map((book) => (
            <div key={book.id} className="col">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
