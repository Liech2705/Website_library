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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserInforController;
use App\Http\Controllers\AdminActivityController;
use App\Http\Controllers\DashboardController;



Route::middleware('auth:sanctum')->group(function () {
    // Các resource không cần admin cho index/show
    Route::apiResource('users', UserController::class)->only(['index', 'show']);
    Route::apiResource('user-infors', UserInforController::class)->only(['index', 'show']);
    Route::apiResource('books', BookController::class)->only(['index', 'show']);
    Route::apiResource('authors', AuthorController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('book-copies', BookCopyController::class)->only(['index', 'show']);
    Route::apiResource('book-authors', BookAuthorController::class)->only(['index', 'show']);
    Route::apiResource('borrow-records', BorrowRecordController::class)->only(['index', 'show']);
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'show']);
    Route::apiResource('reservation', ReservationController::class)->only(['index', 'show']);

    // Các api custom ở ngoài
    Route::get('/borrow-history/{userId}', [BorrowRecordController::class, 'history']);
    Route::get('/notifications/user/{userId}', [NotificationController::class, 'getByUser']);
    Route::post('/users/avatar', [UserInforController::class, 'updateAvatar']);
    Route::post('/update-infor', [UserInforController::class, 'updateProfile']);
    Route::get('/user-infor/me', [UserInforController::class, 'getMyInfor']);
    Route::get('/user-infor/{userId}', [UserInforController::class, 'getInforByUserId']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

    // Các thao tác thêm/sửa/xóa chỉ cho admin
    Route::middleware('adminonly')->group(function () {
        Route::apiResource('users', UserController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('user-infors', UserInforController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('books', BookController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('book-copies', BookCopyController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('book-authors', BookAuthorController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('borrow-records', BorrowRecordController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('notifications', NotificationController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('reservation', ReservationController::class)->only(['store', 'update', 'destroy']);

        // Routes cho admin activities
        Route::get('/admin-activities', [AdminActivityController::class, 'index']);
        Route::get('/admin-activities/{adminId}', [AdminActivityController::class, 'show']);
        Route::delete('/admin-activities/{id}', [AdminActivityController::class, 'destroy']);

        //Routes costum
        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
        Route::get('/dashboard/new-books', [DashboardController::class, 'newBooks']);
        Route::get('/dashboard/new-readers', [DashboardController::class, 'newReaders']);
        Route::get('/statistics/books', [BookController::class, 'statistics']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Routes không cần authentication - không có middleware
Route::get('/reviews_books', [BookController::class, '_index']);
Route::get('/reviews_books/{id}', [BookController::class, 'show']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


