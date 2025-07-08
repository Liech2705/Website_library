import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import BookCard from "../components/BookCard";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await ApiService.getBooks();
        setBooks(res);
      } catch (error) {
        console.error("Lỗi khi tải sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Lọc sách hay (dựa theo lượt mượn cao nhất)
  const topBooks = [...books]
    .filter((b) => b.borrowCount != null)
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 8);

  // Lọc sách mới nhất
  const newBooks = [...books]
    .filter((b) => b.year)
    .sort((a, b) => b.year - a.year)
    .slice(-8)
    .reverse();

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        {/* Carousel */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-10">
            <div
              id="bookCarousel"
              className="carousel slide carousel-fade shadow-sm"
              data-bs-ride="carousel"
              data-bs-interval="3000"
            >
              <div className="carousel-inner rounded">
                {[
                  {
                    img: "https://listsach.com/wp-content/uploads/2020/05/bia-sach-dep-top-sach-hay-bia-dep-tang-ban-be-nguoi-yeu.jpg",
                    title: "Không gian học tập lý tưởng",
                    desc: "Thư viện hiện đại, yên tĩnh, đầy đủ tài liệu",
                    active: true,
                  },
                  {
                    img: "https://cdn.baolaocai.vn/images/afaec9937c6b7f52cca20a1d3ca791a1c8c73c8fcf635cc52c5f103b3211ccf87f04473782bd94f2b9b735092d2fb1123bf164fd6dcd271b5d560dd9d5dd79a4/bs-giai1a-982-1504.jpg",
                    title: "Kho sách đa dạng",
                    desc: "Từ sách giáo trình, kỹ năng, văn học, nghiên cứu",
                  },
                  {
                    img: "https://bizweb.dktcdn.net/100/490/482/files/thiet-ke-bia-sach-thieu-nhi-1-tuelamlinh.jpg?v=1694260486812",
                    title: "Thư viện số thông minh",
                    desc: "Tra cứu, mượn sách online nhanh chóng, dễ dàng",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${item.active ? "active" : ""}`}
                  >
                    <img src={item.img} className="d-block w-100" alt={item.title} />
                    <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                      <h5>{item.title}</h5>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#bookCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" />
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#bookCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && <p className="text-center text-muted">Đang tải sách...</p>}

        {!loading && (
          <>
            {/* 📈 Sách hay nên đọc */}
            <section className="mb-5">
              <h3 className="mb-3 text-primary">📈 Sách Hay Nên Đọc</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                {topBooks.map((book) => (
                  <div className="col" key={book.id}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </section>

            {/* 🆕 Sách mới */}
            <section className="mb-5">
              <h3 className="mb-3 text-success">🆕 Sách Mới</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                {newBooks.map((book) => (
                  <div className="col" key={book.id}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
