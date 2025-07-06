import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import ApiService from "../services/api";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "Tất cả",
    author: "",
    publisher: "",
    year: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await ApiService.getBooks();
        if (booksData && Array.isArray(booksData)) {
          setBooks(booksData);
        } else {
          console.error("Dữ liệu không hợp lệ:", booksData);
          setBooks([]);
        }
      } catch (error) {
        console.error("Lỗi tải sách:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Đang tải danh sách sách...</p>
      </div>
    );
  }

  const categories = [
    "Tất cả",
    ...new Set(
      books.map((b) =>
        typeof b.category === "object" && b.category?.name
          ? b.category.name
          : typeof b.category === "string"
            ? b.category
            : "Chưa phân loại"
      )
    ),
  ];

  const filtered = books.filter((book) => {
    const keyword = filters.keyword.toLowerCase();
    const title = book.title?.toLowerCase() || "";
    const authorNames =
      book.authors?.map((a) => a.name.toLowerCase()).join(", ") || "";
    const category =
      typeof book.category === "object" && book.category?.name
        ? book.category.name
        : typeof book.category === "string"
          ? book.category
          : "Chưa phân loại";
    const publisher = book.publisher?.toLowerCase() || "";
    const year = String(book.year || "");

    return (
      title.includes(keyword) &&
      (filters.category === "Tất cả" || category === filters.category) &&
      authorNames.includes(filters.author.toLowerCase()) &&
      publisher.includes(filters.publisher.toLowerCase()) &&
      year.includes(filters.year)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / booksPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="container py-4">
      <form className="row g-2 mb-4">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Từ khóa"
            value={filters.keyword}
            onChange={(e) => {
              setFilters({ ...filters, keyword: e.target.value });
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value });
              setCurrentPage(1);
            }}
          >
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tác giả"
            value={filters.author}
            onChange={(e) => {
              setFilters({ ...filters, author: e.target.value });
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="NXB"
            value={filters.publisher}
            onChange={(e) => {
              setFilters({ ...filters, publisher: e.target.value });
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Năm xuất bản"
            value={filters.year}
            onChange={(e) => {
              setFilters({ ...filters, year: e.target.value });
              setCurrentPage(1);
            }}
          />
        </div>
      </form>

      {paginated.length > 0 ? (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {paginated.map((book) => (
              <div key={book.id} className="col">
                <BookCard book={book} />
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  «
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  »
                </button>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="alert alert-warning text-center">
          Không tìm thấy sách phù hợp với bộ lọc.
        </div>
      )}
    </div>
  );
}