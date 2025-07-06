<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookCopy;
use App\Models\Book;

class BookCopySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả books để tạo copies
        $books = Book::all();

        foreach ($books as $book) {
            // Tạo 2-5 copies cho mỗi book
            $numCopies = rand(2, 5);

            for ($i = 1; $i <= $numCopies; $i++) {
                $status = $this->getRandomStatus();
                $year = $this->getRandomYear($book->publication_year ?? 2020);

                BookCopy::create([
                    'id_book' => $book->id,
                    'copynumber' => "COPY-{$book->id}-{$i}",
                    'year' => $year,
                    'status' => $status,
                    'location' => $this->getRandomLocation(),
                ]);
            }
        }

        // Tạo thêm một số copies đặc biệt
        $this->createSpecialCopies();
    }

    private function getRandomStatus(): string
    {
        $statuses = ['available', 'borrowed', 'lost', 'damaged'];
        $weights = [70, 20, 5, 5]; // 70% available, 20% borrowed, 5% lost, 5% damaged

        $random = rand(1, 100);
        $cumulative = 0;

        foreach ($weights as $index => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $statuses[$index];
            }
        }

        return 'available';
    }

    private function getRandomYear(int $baseYear): int
    {
        // Tạo năm trong khoảng ±3 năm so với năm xuất bản gốc
        $minYear = max($baseYear - 3, 1990);
        $maxYear = min($baseYear + 3, date('Y'));

        return rand($minYear, $maxYear);
    }

    private function getRandomLocation(): string
    {
        $locations = [
            'Kệ A - Tầng 1',
            'Kệ B - Tầng 1',
            'Kệ C - Tầng 1',
            'Kệ A - Tầng 2',
            'Kệ B - Tầng 2',
            'Kệ C - Tầng 2',
            'Kệ D - Tầng 2',
            'Kệ A - Tầng 3',
            'Kệ B - Tầng 3',
            'Kệ C - Tầng 3',
            'Kho sách cũ',
            'Phòng đọc đặc biệt',
            'Kệ sách mới',
            'Kệ sách tham khảo',
            'Kệ sách giáo khoa'
        ];

        return $locations[array_rand($locations)];
    }

    private function createSpecialCopies(): void
    {
        // Tạo một số copies đặc biệt cho sách nổi tiếng
        $specialBooks = Book::inRandomOrder()->limit(5)->get();

        foreach ($specialBooks as $book) {
            // Tạo thêm 3-5 copies cho sách đặc biệt
            $numExtraCopies = rand(3, 5);

            for ($i = 1; $i <= $numExtraCopies; $i++) {
                BookCopy::create([
                    'id_book' => $book->id,
                    'copynumber' => "SPECIAL-{$book->id}-{$i}",
                    'year' => $book->publication_year ?? 2023,
                    'status' => 'available',
                    'location' => 'Kệ sách đặc biệt - Tầng 1',
                ]);
            }
        }
    }
}
