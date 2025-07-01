const books = [
  {
    id: 101,
    title: "Cây Cam Ngọt Của Tôi",
    authors: [
      { id: 1, name: "Nguyễn Bích Lan" },
      { id: 2, name: "Tô Yến Ly" }
    ],
    category: { id: 1, name: "Văn học" },
    publisher: "NXB Hội Nhà Văn",
    year: 2020,
    views: 0,
    book_copies: [{}],
    image: "https://cdn.nhandan.vn/images/1ea1ae7a315d88fc6fbf43696082611523490f259dc3bd55a7ac4c6a5fae73537b054ce8d9817d04eb1c5b0b68cef9b71e8364d0e27d5fd65c42a66debd58689/doc-sach-9398.png"
  },
  {
    id: 102,
    title: "Lập Trình Python Cơ Bản",
    authors: [{ id: 3, name: "Phạm Văn Bình" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Giáo Dục",
    year: 2022,
    views: 87,
    book_copies: [],
    image: "https://img.freepik.com/free-photo/modern-laptop-computer-desk_23-2147847115.jpg"
  },
  {
    id: 103,
    title: "Giải Tích 1",
    authors: [{ id: 4, name: "Nguyễn Văn Toàn" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Đại Học Quốc Gia",
    year: 2021,
    views: 210,
    book_copies: [{}],
    image: "https://img.freepik.com/premium-vector/abstract-math-cover-design-template_23-2148994529.jpg"
  },
  {
    id: 104,
    title: "Tâm Lý Học Đại Cương",
    authors: [{ id: 5, name: "Lê Thị Hằng" }],
    category: { id: 4, name: "Tâm lý học" },
    publisher: "NXB Khoa Học Xã Hội",
    year: 2019,
    views: 75,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/open-book-concept-illustration_114360-7477.jpg"
  },
  {
    id: 105,
    title: "Thiết Kế Web Hiện Đại",
    authors: [{ id: 6, name: "Ngô Nhật Hào" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Lao Động",
    year: 2021,
    views: 95,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/website-creator-concept-illustration_114360-3241.jpg"
  },
  {
    id: 106,
    title: "Giáo Trình Cấu Trúc Dữ Liệu",
    authors: [{ id: 7, name: "Trần Quốc Dũng" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Bách Khoa",
    year: 2020,
    views: 122,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/data-organization-concept-illustration_114360-2851.jpg"
  },
  {
    id: 107,
    title: "Đại Số Tuyến Tính",
    authors: [{ id: 8, name: "Lê Quang Hưng" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Giáo Dục",
    year: 2018,
    views: 201,
    book_copies: [],
    image: "https://img.freepik.com/free-vector/maths-school-subject-banner_107791-17294.jpg"
  },
  {
    id: 108,
    title: "Những Đứa Trẻ Trong Sương",
    authors: [{ id: 9, name: "Diễm My" }],
    category: { id: 1, name: "Văn học" },
    publisher: "NXB Trẻ",
    year: 2023,
    views: 150,
    book_copies: [{}],
    image: "https://img.freepik.com/free-photo/children-book-cover-design_53876-94823.jpg"
  },
  {
    id: 109,
    title: "Lập Trình Java Nâng Cao",
    authors: [{ id: 10, name: "Phan Minh Thái" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Công Nghệ",
    year: 2021,
    views: 112,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/java-programming-concept_23-2148749193.jpg"
  },
  {
    id: 110,
    title: "Phân Tích Dữ Liệu Với Python",
    authors: [{ id: 11, name: "Lê Thảo" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Đại Học Quốc Gia",
    year: 2023,
    views: 130,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/statistics-concept-illustration_114360-8706.jpg"
  },
  {
    id: 111,
    title: "Tâm Lý Trẻ Em",
    authors: [{ id: 12, name: "Phạm Như Lan" }],
    category: { id: 4, name: "Tâm lý học" },
    publisher: "NXB Phụ Nữ",
    year: 2017,
    views: 89,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/baby-psychology-concept-illustration_114360-8902.jpg"
  },
  {
    id: 112,
    title: "Giải Tích 2",
    authors: [{ id: 13, name: "Đặng Văn Hòa" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Đại Học Quốc Gia",
    year: 2022,
    views: 178,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/creative-geometry-design_23-2148894661.jpg"
  },
  {
    id: 113,
    title: "Tự Học Thiết Kế UX/UI",
    authors: [{ id: 14, name: "Trịnh Văn Tùng" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Thanh Niên",
    year: 2020,
    views: 199,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/ux-ui-designer-concept-illustration_114360-1067.jpg"
  },
  {
    id: 114,
    title: "Chân Dung Tâm Lý",
    authors: [{ id: 15, name: "Nguyễn Hồng Phúc" }],
    category: { id: 4, name: "Tâm lý học" },
    publisher: "NXB Tri Thức",
    year: 2021,
    views: 85,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/psychology-illustration_23-2148697332.jpg"
  },
  {
    id: 115,
    title: "Kỹ Năng Giao Tiếp Hiệu Quả",
    authors: [{ id: 16, name: "Nguyễn Quang Tèo" }],
    category: { id: 5, name: "Kỹ năng sống" },
    publisher: "NXB Lao Động",
    year: 2018,
    views: 220,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/communication-concept-illustration_114360-3766.jpg"
  },
  {
    id: 116,
    title: "Tư Duy Nhanh Và Chậm",
    authors: [{ id: 17, name: "Daniel Kahneman" }],
    category: { id: 5, name: "Kỹ năng sống" },
    publisher: "NXB Alpha Books",
    year: 2021,
    views: 321,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/decision-making-concept-illustration_114360-7895.jpg"
  },
  {
    id: 117,
    title: "Bí Quyết Luyện Thi Đại Học",
    authors: [{ id: 18, name: "Lê Văn Thành" }],
    category: { id: 6, name: "Giáo trình" },
    publisher: "NXB Giáo Dục",
    year: 2020,
    views: 310,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/book-lover-concept-illustration_114360-10574.jpg"
  },
  {
    id: 118,
    title: "Lịch Sử Thế Giới Cận Đại",
    authors: [{ id: 19, name: "Trần Thị Mai" }],
    category: { id: 7, name: "Lịch sử" },
    publisher: "NXB Chính Trị Quốc Gia",
    year: 2019,
    views: 160,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/history-illustration_23-2148498439.jpg"
  },
  {
    id: 119,
    title: "Nghệ Thuật Sống Tích Cực",
    authors: [{ id: 20, name: "Tony Robbins" }],
    category: { id: 5, name: "Kỹ năng sống" },
    publisher: "NXB Tổng Hợp",
    year: 2022,
    views: 298,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/happiness-concept-illustration_114360-1652.jpg"
  },
  {
    id: 120,
    title: "Tìm Hiểu Vũ Trụ",
    authors: [{ id: 21, name: "Stephen Hawking" }],
    category: { id: 8, name: "Khoa học" },
    publisher: "NXB Khoa Học Tự Nhiên",
    year: 2016,
    views: 380,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/galaxy-concept-illustration_114360-2922.jpg"
  },
  {
    id: 121,
    title: "Cơ Sở Dữ Liệu",
    authors: [{ id: 22, name: "Nguyễn Trọng Nhân" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Bách Khoa",
    year: 2023,
    views: 187,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/database-concept-illustration_114360-2884.jpg"
  },
  {
    id: 122,
    title: "Trí Tuệ Nhân Tạo Cơ Bản",
    authors: [{ id: 23, name: "Vũ Đức Thịnh" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Thống Kê",
    year: 2022,
    views: 265,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-2798.jpg"
  },
  {
    id: 123,
    title: "Học Máy Và Ứng Dụng",
    authors: [{ id: 24, name: "Trần Văn Khải" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Khoa Học",
    year: 2022,
    views: 140,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/machine-learning-concept-illustration_114360-7276.jpg"
  },
  {
    id: 124,
    title: "Xác Suất Thống Kê",
    authors: [{ id: 25, name: "Phạm Văn Lâm" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Đại Học Sư Phạm",
    year: 2019,
    views: 192,
    book_copies: [{}],
    image: "https://img.freepik.com/free-vector/statistical-analysis-concept-illustration_114360-8289.jpg"
  }
];

export default books;