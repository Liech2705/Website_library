<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrow_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('id_bookcopy');
            $table->dateTime('start_time');
            $table->dateTime('due_time');
            $table->dateTime('end_time')->nullable();
            $table->boolean('is_extended_request')->default(false);
            $table->enum('is_extended_approved', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_return')->default(false);
            $table->integer('renew_count')->default(0);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // Nếu có bảng bookcopies:
            // $table->foreign('id_bookcopy')->references('id')->on('bookcopies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrow_records');
    }
};
