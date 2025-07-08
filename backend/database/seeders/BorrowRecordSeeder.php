<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BorrowRecord;
use App\Models\BookCopy;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BorrowRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nếu có factory thì dùng factory
        // BorrowRecord::factory()->count(10)->create();

        // Nếu không có factory, tạo thủ công
        $now = now();
        $records = [];
        for ($i = 1; $i <= 10; $i++) {
            $records[] = [
                'user_id' => 1, // hoặc random user id nếu có nhiều user
                'id_bookcopy' => $i, // hoặc random bookcopy id nếu có nhiều bookcopy
                'start_time' => $now->copy()->subDays(20 - $i),
                'due_time' => $now->copy()->subDays(10 - $i),
                'end_time' => $i % 2 == 0 ? $now->copy()->subDays(5 - $i) : null,
                'is_extended_request' => false,
                'is_extended_approved' => 'pending',
                'is_return' => $i % 2 == 0,
                'renew_count' => rand(0, 2),
                'note' => 'Ghi chú mượn sách ' . $i,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('borrow_records')->insert($records);

        // Lấy users và book copies
        $users = User::where('role', 'user')->get();
        $bookCopies = BookCopy::where('status', 'borrowed')->get();

        // Nếu không có copies đã borrowed, tạo một số
        if ($bookCopies->isEmpty()) {
            $availableCopies = BookCopy::where('status', 'available')->limit(10)->get();
            foreach ($availableCopies as $copy) {
                $copy->update(['status' => 'borrowed']);
                $bookCopies->push($copy);
            }
        }

        foreach ($bookCopies as $copy) {
            if ($users->isNotEmpty()) {
                $userId = User::inRandomOrder()->value('id');
                $borrowDate = $this->getRandomBorrowDate();
                $dueDate = $borrowDate->copy()->addDays(14); // Mượn 14 ngày
                $returnDate = $this->getRandomReturnDate($borrowDate, $dueDate);

                BorrowRecord::create([
                    'user_id' => $userId,
                    'id_bookcopy' => $copy->id,
                    'start_time' => $borrowDate,
                    'due_time' => $dueDate,
                    'end_time' => $returnDate,
                    'is_extended_request' => false,
                    'is_extended_approved' => 'pending',
                    'is_return' => $returnDate ? true : false,
                    'renew_count' => rand(0, 2),
                    'note' => $this->getRandomNotes(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Tạo thêm một số records lịch sử
        $this->createHistoricalRecords($users);
    }

    private function getRandomBorrowDate(): Carbon
    {
        // Tạo ngày mượn trong 3 tháng gần đây
        $startDate = Carbon::now()->subMonths(3);
        $endDate = Carbon::now();

        return Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp));
    }

    private function getRandomReturnDate(Carbon $borrowDate, Carbon $dueDate): ?Carbon
    {
        // 80% trả đúng hạn hoặc sớm hơn, 20% trả muộn
        if (rand(1, 100) <= 80) {
            // Trả đúng hạn hoặc sớm hơn
            $returnDate = $borrowDate->copy()->addDays(rand(1, 14));
            return $returnDate->isAfter($dueDate) ? $dueDate : $returnDate;
        } else {
            // Trả muộn
            return $dueDate->copy()->addDays(rand(1, 30));
        }
    }

    private function getRandomNotes(): ?string
    {
        $notes = [
            null,
            'Sách được bảo quản tốt',
            'Có một số trang bị nhăn nhẹ',
            'Sách mới, tình trạng tốt',
            'Cần kiểm tra kỹ khi trả',
            'Đọc tại thư viện',
            'Mượn cho nghiên cứu',
            'Sách tham khảo',
            'Đọc cho dự án học tập',
            'Mượn cho bạn bè đọc'
        ];

        return $notes[array_rand($notes)];
    }

    private function createHistoricalRecords($users): void
    {
        // Tạo records lịch sử (đã trả)
        $availableCopies = BookCopy::where('status', 'available')->limit(20)->get();

        foreach ($availableCopies as $copy) {
            if ($users->isNotEmpty()) {
                $user = $users->random();
                $borrowDate = Carbon::now()->subMonths(rand(4, 12));
                $dueDate = $borrowDate->copy()->addDays(14);
                $returnDate = $dueDate->copy()->addDays(rand(-7, 7)); // Trả trong khoảng ±7 ngày so với hạn

                BorrowRecord::create([
                    'user_id' => $user->id,
                    'id_bookcopy' => $copy->id,
                    'start_time' => $borrowDate,
                    'due_time' => $dueDate,
                    'end_time' => $returnDate,
                    'is_extended_request' => false,
                    'is_extended_approved' => 'pending',
                    'is_return' => $returnDate ? true : false,
                    'renew_count' => rand(0, 2),
                    'note' => 'Đã trả sách',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
