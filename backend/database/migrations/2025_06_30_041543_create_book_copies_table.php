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
        Schema::create('book_copies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_book');
            $table->char('copynumber', 255);
            $table->year('year')->nullable();
            $table->enum('status', ['available', 'borrowed', 'lost', 'damaged'])->default('available');
            $table->string('location', 255)->nullable();
            $table->timestamps();

            $table->foreign('id_book')->references('id')->on('books')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_copies');
    }
};
