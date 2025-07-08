<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\Book;
use App\Models\User;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $books = Book::all();

        if ($users->isEmpty() || $books->isEmpty()) {
            return;
        }

        // Tạo 30 reservation mẫu
        for ($i = 0; $i < 30; $i++) {
            $user = $users->random();
            $book = $books->random();
            $status = $this->randomStatus();
            $createdAt = Carbon::now()->subDays(rand(0, 30))->setTime(rand(8, 18), rand(0, 59));
            $notifiedTime = null;
            $expireTime = null;

            if ($status === 'notified') {
                $notifiedTime = $createdAt->copy()->addDays(rand(1, 3));
                $expireTime = $notifiedTime->copy()->addDays(7);
            } elseif ($status === 'expired') {
                $notifiedTime = $createdAt->copy()->addDays(rand(1, 3));
                $expireTime = $notifiedTime->copy()->addDays(7);
                // expire_time đã qua
                $expireTime->subDays(rand(1, 5));
            } elseif ($status === 'pending') {
                // Chưa thông báo, expire_time null
            } elseif ($status === 'cancelled') {
                // Có thể đã thông báo, có thể chưa
                if (rand(0, 1)) {
                    $notifiedTime = $createdAt->copy()->addDays(rand(1, 3));
                    $expireTime = $notifiedTime->copy()->addDays(7);
                }
            }

            Reservation::create([
                'user_id' => $user->id,
                'id_book' => $book->id,
                'status' => $status,
                'notified_time' => $notifiedTime,
                'expire_time' => $expireTime,
                'created_at' => $createdAt,
            ]);
        }
    }

    private function randomStatus(): string
    {
        $statuses = ['pending', 'notified', 'expired', 'cancelled'];
        $weights = [50, 25, 15, 10]; // 50% pending, 25% notified, 15% expired, 10% cancelled
        $rand = rand(1, 100);
        $cum = 0;
        foreach ($weights as $i => $w) {
            $cum += $w;
            if ($rand <= $cum) return $statuses[$i];
        }
        return 'pending';
    }
}
