<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookAuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\BorrowRecordController;
use App\Http\Controllers\BookCopyController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('test', function () {
    return ['message' => 'API OK'];
});
Route::get('/books_', [BookController::class, '_index']);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('authors', AuthorController::class);
Route::apiResource('book-authors', BookAuthorController::class);
Route::apiResource('books', BookController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('notifications', NotificationController::class);
Route::apiResource('borrow-records', BorrowRecordController::class);
Route::apiResource('book-copies', BookCopyController::class);