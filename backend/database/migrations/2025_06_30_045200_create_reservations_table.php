<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_book');
            $table->enum('status', ['pending', 'notified', 'expired', 'cancelled']);
            $table->dateTime('notified_time')->nullable();
            $table->dateTime('expire_time')->nullable();
            $table->dateTime('created_at');
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_book')->references('id')->on('books')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
