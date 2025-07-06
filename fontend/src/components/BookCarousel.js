import React, { useState } from "react";
import BookCard from "./BookCard";


export default function BookCarousel({ books, title }) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount < books.length ? prev + visibleCount : 0
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev - visibleCount >= 0 ? prev - visibleCount : books.length - visibleCount
    );
  };

  const visibleBooks = books.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">📚 {title}</h3>
        <div>
          <button className="btn btn-outline-dark me-2" onClick={handlePrev}>
            ◀
          </button>
          <button className="btn btn-outline-dark" onClick={handleNext}>
            ▶
          </button>
        </div>
      </div>

      <div className="row g-4 book-carousel">
        {visibleBooks.map((book) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-2" key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
