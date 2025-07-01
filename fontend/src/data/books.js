var books = [];
await fetch('http://localhost:8000/api/books_')
  .then(response => response.json())
  .then(data => {
    books = data; // Dữ liệu sách từ backend
  })
  .catch(error => {
    console.error('Error:', error);
  });

  console.log(books)
export default books;