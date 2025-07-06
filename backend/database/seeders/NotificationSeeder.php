<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) return;

        $types = ['info', 'success', 'warning', 'error'];
        $actions = [
            null,
            'https://library.local/books',
            'https://library.local/profile',
            'https://library.local/notifications',
        ];

        foreach ($users as $user) {
            $num = rand(5, 10);
            for ($i = 0; $i < $num; $i++) {
                $type = $types[array_rand($types)];
                $isRead = (bool)rand(0, 1);
                $created = Carbon::now()->subDays(rand(0, 30))->setTime(rand(8, 18), rand(0, 59));
                $title = $this->randomTitle($type);
                $message = $this->randomMessage($type, $user->name);
                $actionUrl = $actions[array_rand($actions)];

                Notification::create([
                    'user_id' => $user->id,
                    'title' => $title,
                    'message' => $message,
                    'type' => $type,
                    'is_read' => $isRead,
                    'action_url' => $actionUrl,
                    'created_at' => $created,
                    'updated_at' => $created,
                ]);
            }
        }
    }

    private function randomTitle($type)
    {
        $titles = [
            'info' => ['Thông báo mới', 'Tin tức thư viện', 'Cập nhật hệ thống'],
            'success' => ['Thành công!', 'Hoàn thành', 'Đặt sách thành công'],
            'warning' => ['Cảnh báo', 'Nhắc nhở trả sách', 'Sắp hết hạn'],
            'error' => ['Lỗi hệ thống', 'Quá hạn trả sách', 'Đặt sách thất bại'],
        ];
        return $titles[$type][array_rand($titles[$type])];
    }

    private function randomMessage($type, $name)
    {
        $messages = [
            'info' => [
                "Chào $name, thư viện có sách mới.",
                "Bạn có thông báo mới từ thư viện.",
                "Hệ thống sẽ bảo trì vào cuối tuần này."
            ],
            'success' => [
                "Bạn đã mượn sách thành công.",
                "Đặt sách thành công, vui lòng đến nhận.",
                "Gia hạn sách thành công."
            ],
            'warning' => [
                "Bạn còn 3 ngày để trả sách.",
                "Sách bạn đặt sắp hết hạn giữ.",
                "Vui lòng kiểm tra lại thông tin cá nhân."
            ],
            'error' => [
                "Bạn đã trả sách trễ hạn.",
                "Đặt sách thất bại, vui lòng thử lại.",
                "Có lỗi xảy ra khi xử lý yêu cầu của bạn."
            ],
        ];
        return $messages[$type][array_rand($messages[$type])];
    }
}
