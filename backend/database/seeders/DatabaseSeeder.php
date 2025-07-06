<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            CategorySeeder::class,
            AuthorSeeder::class,
            BookSeeder::class,
            BookAuthorSeeder::class,
            BookCopySeeder::class,
            BorrowRecordSeeder::class,
            ReservationSeeder::class,
            UserSeeder::class,
            NotificationSeeder::class,
            // ... các seeder khác
        ]);
    }
}
