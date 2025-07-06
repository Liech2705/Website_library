<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BorrowRecord;
use App\Models\BookCopy;
use App\Models\User;
use Carbon\Carbon;

class BorrowRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
                $user = $users->random();
                $borrowDate = $this->getRandomBorrowDate();
                $dueDate = $borrowDate->copy()->addDays(14); // Mượn 14 ngày
                $returnDate = $this->getRandomReturnDate($borrowDate, $dueDate);

                BorrowRecord::create([
                    'user_id' => $user->id,
                    'book_copy_id' => $copy->id,
                    'borrow_date' => $borrowDate,
                    'due_date' => $dueDate,
                    'return_date' => $returnDate,
                    'status' => $returnDate ? 'returned' : 'borrowed',
                    'notes' => $this->getRandomNotes(),
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
                    'book_copy_id' => $copy->id,
                    'borrow_date' => $borrowDate,
                    'due_date' => $dueDate,
                    'return_date' => $returnDate,
                    'status' => 'returned',
                    'notes' => 'Đã trả sách',
                ]);
            }
        }
    }
}
