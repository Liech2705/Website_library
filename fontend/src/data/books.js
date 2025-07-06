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
    borrowCount: 125,
    views: 0,
    book_copies: [{ status: "available" }],
    image: "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg"
  },
  {
    id: 102,
    title: "Lập Trình Python Cơ Bản",
    authors: [{ id: 3, name: "Phạm Văn Bình" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Giáo Dục",
    year: 2022,
    borrowCount: 100,
    views: 87,
    book_copies: [{ status: "available" }],
    image: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/lap_trinh_co_ban___tu_hoc_python_bang_hinh_anh/2022_06_21_14_58_24_1-390x510.jpg"
  },
  {
    id: 103,
    title: "Giải Tích 1",
    authors: [{ id: 4, name: "Nguyễn Văn Toàn" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Đại Học Quốc Gia",
    year: 2021,
    borrowCount: 15,
    views: 210,
    book_copies: [{ status: "borrowed" }],
    image: "https://images.nxbbachkhoa.vn/Picture/2022/5/23/image-20220523170243891.jpg"
  },
  {
    id: 104,
    title: "Tâm Lý Học Đại Cương",
    authors: [{ id: 5, name: "Lê Thị Hằng" }],
    category: { id: 4, name: "Tâm lý học" },
    publisher: "NXB Khoa Học Xã Hội",
    year: 2019,
        borrowCount: 18,
    views: 75,
    book_copies: [{ status: "available" }],
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEid_xd1-T4viEEfFvg_mjVbLdWJfCIXXhx4iP2D-xjen4ha2lwWTLsl5PjuE5zT6YgzooPoO2ibc6TeaTco4dCmphJQ4EFwPdnvvFoGLSAePsxok6d4v5nsAIR9vNX6Jm7HaI3RCOjTpxH6j-SqSA4gBeZVu2PbQnnZxAgbJpOZDajw61nibguYidOpbA/s1080/GT%20Tam%20ly%20hoc%20dai%20cuong.png"
  },
  {
    id: 105,
    title: "Thiết Kế Web Hiện Đại",
    authors: [{ id: 6, name: "Ngô Nhật Hào" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Lao Động",
    year: 2021,
    views: 95,
    book_copies: [{ status: "borrowed" }],
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
    book_copies: [{ status: "available" }],
    image: "https://salt.tikicdn.com/cache/w1200/ts/product/18/36/52/329126ad0de0101a85dce7460df2aec7.jpg"
  },
  {
    id: 107,
    title: "Đại Số Tuyến Tính",
    authors: [{ id: 8, name: "Lê Quang Hưng" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Giáo Dục",
    year: 2018,
    views: 201,
    book_copies: [{ status: "borrowed" }],
    image: "https://salt.tikicdn.com/ts/product/d3/98/7f/f5359fbff87c6219c689f5bac4e4e73f.jpg"
  },
  {
    id: 108,
    title: "Những Đứa Trẻ Trong Sương",
    authors: [{ id: 9, name: "Diễm My" }],
    category: { id: 1, name: "Văn học" },
    publisher: "NXB Trẻ",
    year: 2023,
    views: 150,
    ook_copies: [{ status: "borrowed" }],
    image: "https://cinema.momocdn.net/img/4386653747201863-cPE4onInKRxaj3quzprFnSF2bGB.jpg"
  },
  {
    id: 109,
    title: "Lập Trình Java Nâng Cao",
    authors: [{ id: 10, name: "Phan Minh Thái" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Công Nghệ",
    year: 2021,
    views: 112,
    ook_copies: [{ status: "available" }],
    image: "https://lic.haui.edu.vn/media/92/t92563.jpg"
  },
  {
    id: 110,
    title: "Phân Tích Dữ Liệu Với Python",
    authors: [{ id: 11, name: "Lê Thảo" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Đại Học Quốc Gia",
    year: 2023,
    views: 130,
    ook_copies: [{ status: "borrowed" }],
    image: "https://cdn.codegym.vn/wp-content/uploads/2023/05/Bia-sach-Phan-tich-du-lieu-voi-Python-su-dung-Pandas-01-scaled.jpg"
  },
  {
    id: 111,
    title: "Tâm Lý Trẻ Em",
    authors: [{ id: 12, name: "Phạm Như Lan" }],
    category: { id: 4, name: "Tâm lý học" },
    publisher: "NXB Phụ Nữ",
    year: 2017,
    views: 89,
    ook_copies: [{ status: "available" }],
    image: "https://images.vnuhcmpress.edu.vn/Picture/2023/tam-ly-tre-em.jpg"
  },
  {
    id: 112,
    title: "Giải Tích 2",
    authors: [{ id: 13, name: "Đặng Văn Hòa" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Đại Học Quốc Gia",
    year: 2022,
    views: 178,
    ook_copies: [{ status: "borrowed" }],
    image: "https://images.nxbxaydung.com.vn/Picture/2020/bia-0605151255.jpg"
  },
  {
    id: 113,
    title: "Tự Học Thiết Kế UX/UI",
    authors: [{ id: 14, name: "Trịnh Văn Tùng" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Thanh Niên",
    year: 2020,
    views: 199,
    ook_copies: [{ status: "available" }],
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
    ook_copies: [{ status: "borrowed" }],
    image: "https://cf.shopee.vn/file/343d1256518aa75a8767e92b0be49181"
  },
  {
    id: 115,
    title: "Kỹ Năng Giao Tiếp Hiệu Quả",
    authors: [{ id: 16, name: "Nguyễn Quang Tèo" }],
    category: { id: 5, name: "Kỹ năng sống" },
    publisher: "NXB Lao Động",
    year: 2018,
    views: 220,
    ook_copies: [{ status: "borrowed" }],
    image: "https://product.hstatic.net/200000696663/product/b_a-1---k_-n_ng-giao-ti_p-hi_u-qu__79a0daf231f44c549f90adbc37c18f1d_1024x1024.jpg"
  },
  {
    id: 116,
    title: "Tư Duy Nhanh Và Chậm",
    authors: [{ id: 17, name: "Daniel Kahneman" }],
    category: { id: 5, name: "Kỹ năng sống" },
    publisher: "NXB Alpha Books",
    year: 2021,
    views: 321,
    ook_copies: [{ status: "borrowed" }],
    image: "https://salt.tikicdn.com/ts/product/e9/83/fe/054e4a69fd2f531b28f46c32c86d5a39.png"
  },
  {
    id: 117,
    title: "Bí Quyết Luyện Thi Đại Học",
    authors: [{ id: 18, name: "Lê Văn Thành" }],
    category: { id: 6, name: "Giáo trình" },
    publisher: "NXB Giáo Dục",
    year: 2020,
    views: 310,
    book_copies: [{ status: "available" }],
    image: "https://4.bp.blogspot.com/-sdJloZV37MU/WX2QkxmJJhI/AAAAAAAAE0M/tGNE73Iy1p4qk1OHLF8aGhoIVehNJv0egCLcBGAs/s400/bi-quyet-luyen-thi-thpt-quoc-gia-mon-vat-li-theo-chu-de-tap-1.jpg"
  },
  {
    id: 118,
    title: "Lịch Sử Thế Giới Cận Đại",
    authors: [{ id: 19, name: "Trần Thị Mai" }],
    category: { id: 7, name: "Lịch sử" },
    publisher: "NXB Chính Trị Quốc Gia",
    year: 2019,
    views: 160,
    book_copies: [{ status: "available" }],
    image: "https://thuviensach.vn/img/news/2022/11/larger/10507-lich-su-the-gioi-can-dai-1.jpg"
  },
  {
    id: 119,
    title: "Nghệ Thuật Sống Tích Cực",
    authors: [{ id: 20, name: "Tony Robbins" }],
    category: { id: 5, name: "Kỹ năng sống" },
    publisher: "NXB Tổng Hợp",
    year: 2022,
    views: 298,
    book_copies: [{ status: "available" }],
    image: "https://product.hstatic.net/200000654445/product/sach-nghe-thuat-song-hanh-phuc_0f0d305a52ec4904bd94ead1c71b9440_master.jpg"
  },
  {
    id: 120,
    title: "Tìm Hiểu Vũ Trụ",
    authors: [{ id: 21, name: "Stephen Hawking" }],
    category: { id: 8, name: "Khoa học" },
    publisher: "NXB Khoa Học Tự Nhiên",
    year: 2016,
    views: 380,
    book_copies: [{ status: "available" }],
    image: "https://down-vn.img.susercontent.com/file/sg-11134201-22110-vme7iimf3akv02"
  },
  {
    id: 121,
    title: "Cơ Sở Dữ Liệu",
    authors: [{ id: 22, name: "Nguyễn Trọng Nhân" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Bách Khoa",
    year: 2023,
    views: 187,
    book_copies: [{ status: "borrowed" }],
    image: "https://book365.vn/upload/uf/92e/5y06p6vofd0g4q3bfj0zdq67pbwtujhj.jpg"
  },
  {
    id: 122,
    title: "Trí Tuệ Nhân Tạo Cơ Bản",
    authors: [{ id: 23, name: "Vũ Đức Thịnh" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Thống Kê",
    year: 2022,
    views: 265,
    book_copies: [{ status: "available" }],
    image: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/ai___tri_tue_nhan_tao___101_dieu_can_biet_ve_tuong_lai_tai_ban_2023/2023_08_29_15_53_05_1-390x510.jpg"
  },
  {
    id: 123,
    title: "Học Máy Và Ứng Dụng",
    authors: [{ id: 24, name: "Trần Văn Khải" }],
    category: { id: 2, name: "Công nghệ thông tin" },
    publisher: "NXB Khoa Học",
    year: 2022,
    views: 140,
    book_copies: [{ status: "available" }],
    image: "https://cdn0.fahasa.com/media/catalog/product/9/7/9786043268942.jpg"
  },
  {
    id: 124,
    title: "Xác Suất Thống Kê",
    authors: [{ id: 25, name: "Phạm Văn Lâm" }],
    category: { id: 3, name: "Toán học" },
    publisher: "NXB Đại Học Sư Phạm",
    year: 2019,
    views: 192,
    book_copies: [{ status: "borrowed" }],
    image: "https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/m/img765.u2487.d20160604.t112257.jpg"
  }
];

export default books;