<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BorrowRecord;
use App\Traits\AdminActivityLogger;

class ReservationController extends Controller
{
    use AdminActivityLogger;

    public function index()
    {
        $reservations = Reservation::with(['user', 'book.bookCopies'])->get();
        
        return response()->json($reservations->map(function ($r) {
            // Lấy trạng thái hiện tại của sách từ book_copies
            $bookStatus = 'Không có bản copy';
            if ($r->book && $r->book->bookCopies) {
                $availableCopies = $r->book->bookCopies->where('status', 'available')->count();
                $borrowedCopies = $r->book->bookCopies->where('status', 'borrowed')->count();
                $pendingCopies = $r->book->bookCopies->where('status', 'pending')->count();
                
                if ($availableCopies > 0) {
                    $bookStatus = "Có sẵn ({$availableCopies} bản)";
                } elseif ($borrowedCopies > 0) {
                    $bookStatus = "Đang mượn ({$borrowedCopies} bản)";
                } elseif ($pendingCopies > 0) {
                    $bookStatus = "Chờ duyệt ({$pendingCopies} bản)";
                } else {
                    $bookStatus = "Hết sách";
                }
            }
            
            return [
                'id' => $r->id,
                'user_id' => $r->user_id,
                'user_name' => $r->user ? $r->user->name : '—',
                'book_id' => $r->id_book,
                'book_title' => $r->book ? $r->book->title : '—',
                'status' => $r->status,
                'book_status' => $bookStatus,
                'notified_time' => $r->notified_time,
                'expire_time' => $r->expire_time,
                'created_at' => $r->created_at,
            ];
        }));
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        
        // Kiểm tra sách có tồn tại không
        $book = Book::find($request->id_book);
        if (!$book) {
            return response()->json(['message' => 'Sách không tồn tại.'], 404);
        }

        $borrowRecord = BorrowRecord::where('user_id', $userId)
            ->where('id_bookcopy', $request->id_bookcopy)
            ->where('is_return', false)
            ->first();

        if ($borrowRecord) {
            return response()->json(['message' => 'Bạn đã mượn sách này rồi.'], 400);
        }
        
        // Kiểm tra user đã đặt trước sách này chưa
        $existingReservation = Reservation::where('user_id', $userId)
            ->where('id_book', $request->id_book)
            ->where('status', 'pending')
            ->first();
            
        if ($existingReservation) {
            return response()->json(['message' => 'Bạn đã đặt trước sách này rồi.'], 400);
        }
        
        // Kiểm tra sách có còn bản copy nào available không
        $availableCopies = BookCopy::where('id_book', $request->id_book)
            ->where('status', 'available')
            ->count();
            
        if ($availableCopies > 0) {
            return response()->json(['message' => 'Sách này hiện có sẵn để mượn, không cần đặt trước.'], 400);
        }
        
        // Tạo đặt trước
        $reservation = Reservation::create([
            'user_id' => $userId,
            'id_book' => $request->id_book,
            'status' => 'pending',
            'notified_time' => null,
            'expire_time' => now()->addDays(7), // Hết hạn sau 7 ngày
            'created_at' => now(),
        ]);
        $this->logCreate('Đặt trước', ['user_id' => $userId, 'book_id' => $request->id_book, 'id' => $reservation->id]);
        
        return response()->json([
            'message' => 'Đặt trước sách thành công.',
            'reservation' => $reservation
        ], 201);
    }

    public function show($id)
    {
        $reservation = Reservation::with(['user', 'book'])->findOrFail($id);
        return response()->json($reservation);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->all());
        $this->logUpdate('Đặt trước', $id, ['user_id' => $reservation->user_id, 'book_id' => $reservation->id_book]);
        return response()->json($reservation, 200);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        $this->logDelete('Đặt trước', $id);
        return response()->json(['message' => 'Hủy đặt trước thành công.'], 200);
    }
    
    // Lấy danh sách đặt trước của user hiện tại
    public function getUserReservations()
    {
        $userId = Auth::id();
        
        $reservations = Reservation::with(['book.bookCopies'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($reservations->map(function ($r) {
            // Lấy trạng thái hiện tại của sách từ book_copies
            $bookStatus = 'Không có bản copy';
            if ($r->book && $r->book->bookCopies) {
                $availableCopies = $r->book->bookCopies->where('status', 'available')->count();
                $borrowedCopies = $r->book->bookCopies->where('status', 'borrowed')->count();
                $pendingCopies = $r->book->bookCopies->where('status', 'pending')->count();
                
                if ($availableCopies > 0) {
                    $bookStatus = "Có sẵn ({$availableCopies} bản)";
                } elseif ($borrowedCopies > 0) {
                    $bookStatus = "Đang mượn ({$borrowedCopies} bản)";
                } elseif ($pendingCopies > 0) {
                    $bookStatus = "Chờ duyệt ({$pendingCopies} bản)";
                } else {
                    $bookStatus = "Hết sách";
                }
            }
            
            return [
                'id' => $r->id,
                'book_id' => $r->id_book,
                'book_title' => $r->book ? $r->book->title : '—',
                'status' => $r->status,
                'book_status' => $bookStatus,
                'notified_time' => $r->notified_time,
                'expire_time' => $r->expire_time,
                'created_at' => $r->created_at,
            ];
        }));
    }
    
    // Thông báo sách có sẵn (cho admin)
    public function notifyBookAvailable($id)
    {
        $reservation = Reservation::findOrFail($id);
        
        // Kiểm tra sách có thực sự available không
        $availableCopies = BookCopy::where('id_book', $reservation->id_book)
            ->where('status', 'available')
            ->count();
            
        if ($availableCopies == 0) {
            return response()->json(['message' => 'Sách chưa có sẵn để thông báo.'], 400);
        }
        
        // Cập nhật trạng thái đặt trước
        $reservation->update([
            'status' => 'notified',
            'notified_time' => now(),
        ]);
        
        // Tạo thông báo cho user
        Notification::create([
            'user_id' => $reservation->user_id,
            'title' => 'Sách có sẵn để mượn',
            'message' => 'Sách "' . ($reservation->book ? $reservation->book->title : '') . '" đã có sẵn để mượn. Vui lòng đến thư viện trong vòng 7 ngày tới.',
            'type' => 'info',
        ]);
        
        return response()->json(['message' => 'Đã thông báo cho user thành công.'], 200);
    }
    
    // Hủy đặt trước (cho user)
    public function cancelReservation($id)
    {
        $userId = Auth::id();
        
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $userId)
            ->first();
            
        if (!$reservation) {
            return response()->json(['message' => 'Không tìm thấy đặt trước.'], 404);
        }
        
        $reservation->delete();
        
        return response()->json(['message' => 'Hủy đặt trước thành công.'], 200);
    }

    // Admin tạo phiếu mượn từ đặt trước đã thông báo
    public function createBorrowFromReservation($id)
    {
        $reservation = Reservation::with(['user', 'book.bookCopies'])->findOrFail($id);
        if ($reservation->status !== 'notified') {
            return response()->json(['message' => 'Chỉ có thể tạo phiếu mượn cho đặt trước đã được thông báo.'], 400);
        }
        // Tìm bản copy available
        $availableCopy = $reservation->book->bookCopies->where('status', 'available')->first();
        if (!$availableCopy) {
            return response()->json(['message' => 'Không còn bản copy nào của sách này để mượn.'], 400);
        }
        // Tạo BorrowRecord
        $borrow = BorrowRecord::create([
            'user_id' => $reservation->user_id,
            'id_bookcopy' => $availableCopy->id,
            'start_time' => now(),
            'due_time' => now()->addDays(14),
            'renew_count' => 0,
            'is_return' => false,
            'is_extended_request' => false,
            'is_extended_approved' => 'pending',
        ]);
        // Cập nhật trạng thái bản copy
        $availableCopy->update(['status' => 'pending']);
        // Xóa reservation hoặc cập nhật trạng thái
        $reservation->delete();
        return response()->json(['message' => 'Tạo phiếu mượn thành công!', 'borrow' => $borrow], 201);
    }
}
