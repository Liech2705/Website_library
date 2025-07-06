<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Văn học', 'description' => 'Sách văn học'],
            ['name' => 'Công nghệ thông tin', 'description' => 'Sách CNTT'],
            ['name' => 'Toán học', 'description' => 'Sách toán học'],
            ['name' => 'Tâm lý học', 'description' => 'Sách tâm lý'],
            ['name' => 'Kỹ năng sống', 'description' => 'Sách kỹ năng sống'],
            ['name' => 'Giáo trình', 'description' => 'Sách giáo trình'],
            ['name' => 'Lịch sử', 'description' => 'Sách lịch sử'],
            ['name' => 'Khoa học', 'description' => 'Sách khoa học'],
        ];
        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
