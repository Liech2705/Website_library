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
    Route::apiResource('borrow-records', BorrowRecordController::class)->only(['index', 'show', 'store']);
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'show']);
    Route::apiResource('reservation', ReservationController::class)->only(['index', 'show']);

    // Các api custom ở ngoài
    Route::get('/borrow-history/{userId}', [BorrowRecordController::class, 'history']);
    Route::post('/borrow-records/{id}/renew', [BorrowRecordController::class, 'renew']);
    Route::post('/borrow-records/{id}/return', [BorrowRecordController::class, 'returnBook']);
    Route::post('/borrow-records/{id}/reject', [BorrowRecordController::class, 'rejectBorrowRecords']);
    Route::get('/notifications/user/{userId}', [NotificationController::class, 'getByUser']);
    Route::post('/users/avatar', [UserInforController::class, 'updateAvatar']);
    Route::post('/update-infor', [UserInforController::class, 'updateProfile']);
    Route::get('/user-infor/me', [UserInforController::class, 'getMyInfor']);
    Route::get('/user-infor/{userId}', [UserInforController::class, 'getInforByUserId']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
    
    // Routes cho đặt trước sách
    Route::get('/reservations/my', [ReservationController::class, 'getUserReservations']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::delete('/reservations/{id}/cancel', [ReservationController::class, 'cancelReservation']);

    // Các thao tác thêm/sửa/xóa chỉ cho admin
    Route::middleware('adminonly')->group(function () {
        Route::apiResource('users', UserController::class)->only(['store', 'update', 'destroy']);

        Route::apiResource('user-infors', UserInforController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('books', BookController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('book-copies', BookCopyController::class)->only(['store', 'update', 'destroy']);
        // Custom: Duyệt và từ chối mượn sách cho bản sao
        Route::post('book-copies/{id}/approve', [BookCopyController::class, 'approveBorrow']);
        Route::post('book-copies/{id}/reject', [BookCopyController::class, 'rejectBorrow']);
        Route::apiResource('book-authors', BookAuthorController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('borrow-records', BorrowRecordController::class)->only(['update', 'destroy']);
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
        Route::post('/borrow-records/{id}/renew', [BorrowRecordController::class, 'renew']);
        Route::post('/borrow-records/{id}/approve', [BorrowRecordController::class, 'approveRenew']);
        Route::post('/borrow-records/{id}/rejectRenew', [BorrowRecordController::class, 'rejectRenew']);
        
        // Routes cho admin quản lý đặt trước sách
        Route::post('/reservations/{id}/notify', [ReservationController::class, 'notifyBookAvailable']);
        Route::post('/reservations/{id}/create-borrow', [ReservationController::class, 'createBorrowFromReservation']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Routes không cần authentication - không có middleware
Route::get('/reviews_books', [BookController::class, 'index']);
Route::get('/reviews_books/{id}', [BookController::class, 'show']);
Route::get('/check-email-exists/{email}', [UserController::class, 'checkEmailExists']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/users/reset-password', [UserController::class, 'resetPassword']);