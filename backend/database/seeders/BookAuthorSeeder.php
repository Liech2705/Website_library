<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookAuthor;

class BookAuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookAuthors = [
            // Cây Cam Ngọt Của Tôi: id sách 1, tác giả 1 và 2
            ['id_book' => 1, 'id_author' => 1],
            ['id_book' => 1, 'id_author' => 2],
            // Lập Trình Python Cơ Bản: id sách 2, tác giả 3
            ['id_book' => 2, 'id_author' => 3],
            // Giải Tích 1: id sách 3, tác giả 4
            ['id_book' => 3, 'id_author' => 4],
            // Tâm Lý Học Đại Cương: id sách 4, tác giả 5
            ['id_book' => 4, 'id_author' => 5],
            // Thiết Kế Web Hiện Đại: id sách 5, tác giả 6
            ['id_book' => 5, 'id_author' => 6],
            // Giáo Trình Cấu Trúc Dữ Liệu: id sách 6, tác giả 7
            ['id_book' => 6, 'id_author' => 7],
            // Đại Số Tuyến Tính: id sách 7, tác giả 8
            ['id_book' => 7, 'id_author' => 8],
            // Những Đứa Trẻ Trong Sương: id sách 8, tác giả 9
            ['id_book' => 8, 'id_author' => 9],
            // Lập Trình Java Nâng Cao: id sách 9, tác giả 10
            ['id_book' => 9, 'id_author' => 10],
            // Phân Tích Dữ Liệu Với Python: id sách 10, tác giả 11
            ['id_book' => 10, 'id_author' => 11],
            // Tâm Lý Trẻ Em: id sách 11, tác giả 12
            ['id_book' => 11, 'id_author' => 12],
            // Giải Tích 2: id sách 12, tác giả 13
            ['id_book' => 12, 'id_author' => 13],
            // Tự Học Thiết Kế UX/UI: id sách 13, tác giả 14
            ['id_book' => 13, 'id_author' => 14],
            // Chân Dung Tâm Lý: id sách 14, tác giả 15
            ['id_book' => 14, 'id_author' => 15],
            // Kỹ Năng Giao Tiếp Hiệu Quả: id sách 15, tác giả 16
            ['id_book' => 15, 'id_author' => 16],
            // Tư Duy Nhanh Và Chậm: id sách 16, tác giả 17
            ['id_book' => 16, 'id_author' => 17],
            // Bí Quyết Luyện Thi Đại Học: id sách 17, tác giả 18
            ['id_book' => 17, 'id_author' => 18]
        ];

        foreach ($bookAuthors as $ba) {
            BookAuthor::create($ba);
        }
    }
}
