<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Thêm giá trị 'spending' vào enum status
        DB::statement("ALTER TABLE book_copies MODIFY status ENUM('available', 'borrowed', 'pending', 'lost', 'damaged') DEFAULT 'available'");
    }

    public function down(): void
    {
        // Loại bỏ giá trị 'spending' khỏi enum status (quay về như cũ)
        DB::statement("ALTER TABLE book_copies MODIFY status ENUM('available', 'borrowed', 'lost', 'damaged') DEFAULT 'available'");
    }
};
