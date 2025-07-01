<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'title' => "Cây Cam Ngọt Của Tôi",
                'id_category' => 1,
                'publisher' => "NXB Hội Nhà Văn",
                'year' => 2020,
                'views' => 0,
                'image' => "https://cdn.nhandan.vn/images/1ea1ae7a315d88fc6fbf43696082611523490f259dc3bd55a7ac4c6a5fae73537b054ce8d9817d04eb1c5b0b68cef9b71e8364d0e27d5fd65c42a66debd58689/doc-sach-9398.png"
            ],
            [
                'title' => "Lập Trình Python Cơ Bản",
                'id_category' => 2,
                'publisher' => "NXB Giáo Dục",
                'year' => 2022,
                'views' => 87,
                'image' => "https://img.freepik.com/free-photo/modern-laptop-computer-desk_23-2147847115.jpg"
            ],
            [
                'title' => "Giải Tích 1",
                'id_category' => 3,
                'publisher' => "NXB Đại Học Quốc Gia",
                'year' => 2021,
                'views' => 210,
                'image' => "https://img.freepik.com/premium-vector/abstract-math-cover-design-template_23-2148994529.jpg"
            ],
            [
                'title' => "Tâm Lý Học Đại Cương",
                'id_category' => 4,
                'publisher' => "NXB Khoa Học Xã Hội",
                'year' => 2019,
                'views' => 75,
                'image' => "https://img.freepik.com/free-vector/open-book-concept-illustration_114360-7477.jpg"
            ],
            [
                'title' => "Thiết Kế Web Hiện Đại",
                'id_category' => 2,
                'publisher' => "NXB Lao Động",
                'year' => 2021,
                'views' => 95,
                'image' => "https://img.freepik.com/free-vector/website-creator-concept-illustration_114360-3241.jpg"
            ],
            [
                'title' => "Giáo Trình Cấu Trúc Dữ Liệu",
                'id_category' => 3,
                'publisher' => "NXB Bách Khoa",
                'year' => 2020,
                'views' => 122,
                'image' => "https://img.freepik.com/free-vector/data-organization-concept-illustration_114360-2851.jpg"
            ],
            [
                'title' => "Đại Số Tuyến Tính",
                'id_category' => 3,
                'publisher' => "NXB Giáo Dục",
                'year' => 2018,
                'views' => 201,
                'image' => "https://img.freepik.com/free-vector/maths-school-subject-banner_107791-17294.jpg"
            ],
            [
                'title' => "Những Đứa Trẻ Trong Sương",
                'id_category' => 1,
                'publisher' => "NXB Trẻ",
                'year' => 2023,
                'views' => 150,
                'image' => "https://img.freepik.com/free-photo/children-book-cover-design_53876-94823.jpg"
            ],
            [
                'title' => "Lập Trình Java Nâng Cao",
                'id_category' => 3,
                'publisher' => "NXB Công Nghệ",
                'year' => 2021,
                'views' => 112,
                'image' => "https://img.freepik.com/free-vector/java-programming-concept_23-2148749193.jpg"
            ],
            [
                'title' => "Phân Tích Dữ Liệu Với Python",
                'id_category' => 3,
                'publisher' => "NXB Đại Học Quốc Gia",
                'year' => 2023,
                'views' => 130,
                'image' => "https://img.freepik.com/free-vector/statistics-concept-illustration_114360-8706.jpg"
            ],
            [
                'title' => "Tâm Lý Trẻ Em",
                'id_category' => 5,
                'publisher' => "NXB Phụ Nữ",
                'year' => 2017,
                'views' => 89,
                'image' => "https://img.freepik.com/free-vector/baby-psychology-concept-illustration_114360-8902.jpg"
            ],
            [
                'title' => "Giải Tích 2",
                'id_category' => 3,
                'publisher' => "NXB Đại Học Quốc Gia",
                'year' => 2022,
                'views' => 178,
                'image' => "https://img.freepik.com/free-vector/creative-geometry-design_23-2148894661.jpg"
            ],
            [
                'title' => "Tự Học Thiết Kế UX/UI",
                'id_category' => 3,
                'publisher' => "NXB Thanh Niên",
                'year' => 2020,
                'views' => 199,
                'image' => "https://img.freepik.com/free-vector/ux-ui-designer-concept-illustration_114360-1067.jpg"
            ],
            [
                'title' => "Chân Dung Tâm Lý",
                'id_category' => 5,
                'publisher' => "NXB Tri Thức",
                'year' => 2021,
                'views' => 85,
                'image' => "https://img.freepik.com/free-vector/psychology-illustration_23-2148697332.jpg"
            ],
            [
                'title' => "Kỹ Năng Giao Tiếp Hiệu Quả",
                'id_category' => 6,
                'publisher' => "NXB Lao Động",
                'year' => 2018,
                'views' => 220,
                'image' => "https://img.freepik.com/free-vector/communication-concept-illustration_114360-3766.jpg"
            ],
            [
                'title' => "Tư Duy Nhanh Và Chậm",
                'id_category' => 6,
                'publisher' => "NXB Alpha Books",
                'year' => 2021,
                'views' => 321,
                'image' => "https://img.freepik.com/free-vector/decision-making-concept-illustration_114360-7895.jpg"
            ],
            [
                'title' => "Bí Quyết Luyện Thi Đại Học",
                'id_category' => 7,
                'publisher' => "NXB Giáo Dục",
                'year' => 2020,
                'views' => 310,
                'image' => "https://img.freepik.com/free-vector/book-lover-concept-illustration_114360-10574.jpg"
            ],
            [
                'title' => "Lịch Sử Thế Giới Cận Đại",
                'id_category' => 8,
                'publisher' => "NXB Chính Trị Quốc Gia",
                'year' => 2019,
                'views' => 160,
                'image' => "https://img.freepik.com/free-vector/history-illustration_23-2148498439.jpg"
            ],
            [
                'title' => "Nghệ Thuật Sống Tích Cực",
                'id_category' => 6,
                'publisher' => "NXB Tổng Hợp",
                'year' => 2022,
                'views' => 298,
                'image' => "https://img.freepik.com/free-vector/happiness-concept-illustration_114360-1652.jpg"
            ],
            [
                'title' => "Tìm Hiểu Vũ Trụ",
                'id_category' => 8,
                'publisher' => "NXB Khoa Học Tự Nhiên",
                'year' => 2016,
                'views' => 380,
                'image' => "https://img.freepik.com/free-vector/galaxy-concept-illustration_114360-2922.jpg"
            ],
            [
                'title' => "Cơ Sở Dữ Liệu",
                'id_category' => 3,
                'publisher' => "NXB Bách Khoa",
                'year' => 2023,
                'views' => 187,
                'image' => "https://img.freepik.com/free-vector/database-concept-illustration_114360-2884.jpg"
            ],
            [
                'title' => "Trí Tuệ Nhân Tạo Cơ Bản",
                'id_category' => 3,
                'publisher' => "NXB Thống Kê",
                'year' => 2022,
                'views' => 265,
                'image' => "https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-2798.jpg"
            ],
            [
                'title' => "Học Máy Và Ứng Dụng",
                'id_category' => 3,
                'publisher' => "NXB Khoa Học",
                'year' => 2022,
                'views' => 140,
                'image' => "https://img.freepik.com/free-vector/machine-learning-concept-illustration_114360-7276.jpg"
            ],
            [
                'title' => "Xác Suất Thống Kê",
                'id_category' => 4,
                'publisher' => "NXB Đại Học Sư Phạm",
                'year' => 2019,
                'views' => 192,
                'image' => "https://img.freepik.com/free-vector/statistical-analysis-concept-illustration_114360-8289.jpg"
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
