<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Hoai Linh',
            'email' => 'hoailinh@student.ctuet.edu.vn',
            'password' => bcrypt('HoaiLinh12345'),
            'role' => 'admin',
            'status' => 'active',
            'lock_until' => null,
        ]);
        User::create([
            'name' => 'Cam Loan',
            'email' => 'camloan@student.ctuet.edu.vn',
            'password' => bcrypt('CamLoan12345'),
            'role' => 'admin',
            'status' => 'active',
            'lock_until' => null,
        ]);
        User::create([
            'name' => 'User Test',
            'email' => 'user@student.ctuet.edu.vn',
            'password' => bcrypt('User12345'),
            'role' => 'user',
            'status' => 'active',
            'lock_until' => null,
        ]);
    }
}
