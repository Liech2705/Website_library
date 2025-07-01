<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            ['name' => 'Nguyễn Bích Lan'],
            ['name' => 'Tô Yến Ly'],
            ['name' => 'Phạm Văn Bình'],
            ['name' => 'Nguyễn Văn Toàn'],
            ['name' => 'Lê Thị Hằng'],
            ['name' => 'Ngô Nhật Hào'],
            ['name' => 'Trần Quốc Dũng'],
            ['name' => 'Lê Quang Hưng'],
            ['name' => 'Diễm My'],
            ['name' => 'Phan Minh Thái'],
            ['name' => 'Lê Thảo'],
            ['name' => 'Phạm Như Lan'],
            ['name' => 'Đặng Văn Hòa'],
            ['name' => 'Trịnh Văn Tùng'],
            ['name' => 'Nguyễn Hồng Phúc'],
            ['name' => 'Nguyễn Quang Tèo'],
            ['name' => 'Daniel Kahneman'],
            ['name' => 'Lê Văn Thành'],
            ['name' => 'Trần Thị Mai'],
            // ... thêm các tác giả khác nếu còn
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
