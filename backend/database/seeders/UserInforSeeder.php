<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User_infor;
use App\Models\User;

class UserInforSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $data = [
            [
                'user_id' => $users[0]->id,
                'phone' => '0901234567',
                'address' => 'Hà Nội',
                'school_name' => 'Đại học Công nghệ',
            ],
            [
                'user_id' => $users[1]->id,
                'phone' => '0912345678',
                'address' => 'Hải Phòng',
                'school_name' => 'Đại học Bách Khoa',
            ],
            [
                'user_id' => $users[2]->id,
                'phone' => '0923456789',
                'address' => 'Cần Thơ',
                'school_name' => 'Đại học Cần Thơ',
            ],
        ];
        foreach ($data as $item) {
            User_infor::create($item);
        }
    }
}
