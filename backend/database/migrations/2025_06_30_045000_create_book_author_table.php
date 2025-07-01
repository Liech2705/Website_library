<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_author', function (Blueprint $table) {
            $table->unsignedBigInteger('id_book');
            $table->unsignedBigInteger('id_author');
            $table->primary(['id_book', 'id_author']);
            $table->foreign('id_book')->references('id')->on('books')->onDelete('cascade');
            $table->foreign('id_author')->references('id')->on('authors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_author');
    }
};
