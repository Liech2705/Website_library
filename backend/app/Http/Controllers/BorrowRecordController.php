<?php

namespace App\Http\Controllers;

use App\Models\BorrowRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BookCopy;
use App\Models\Notification;
use App\Traits\AdminActivityLogger;

class BorrowRecordController extends Controller
{
    use AdminActivityLogger;

    public function index()
    {
        // Lấy tất cả borrow records cùng với user (độc giả) và bookCopy.book (sách)
        $records = BorrowRecord::with([
            'user', // người mượn
            'bookCopy.book', // bản sao sách và sách
        ])->get();
    
        $result = $records->map(function ($r) {
            return [
                'id' => $r->id,
                'id_bookcopy' => $r->id_bookcopy,
                'reader' => $r->user ? $r->user->name : '—',
                'bookTitle' => $r->bookCopy && $r->bookCopy->book ? $r->bookCopy->book->title : '—',
                'quantity' => 1, // mỗi phiếu là 1 bản copy, nếu có quantity thì lấy $r->quantity
                'borrowDate' => $r->start_time,
                'dueDate' => $r->due_time,
                'note' => $r->note,
                'returned' => $r->is_return == 1,
                'status' => $r->is_return 
                ? 'returned' 
                : ($r->bookCopy->status === 'pending' ? 'pending' : 'borrowed'), // Thêm dòng này
                'is_extended_request' => $r->is_extended_request,
                'is_extended_approved' => $r->is_extended_approved,
                'renew_count' => $r->renew_count,
            ];
        });
    
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $userId = Auth::id(); // Lấy id user hiện tại

        // 1. Kiểm tra user đã mượn cuốn sách này chưa (chưa trả)
        $userBorrowed = BorrowRecord::where('user_id', $userId)
            ->whereHas('bookCopy', function ($q) use ($request) {
                $q->where('id_book', $request->id_book);
            })
            ->where('is_return', false)
            ->exists();
        
        $borrow = BorrowRecord::where('user_id', $userId)
            ->where('id_bookcopy', $request->id_bookcopy)
            ->where('is_return', false)
            ->first();

        if ($borrow) {
            return response()->json(['message' => 'Bạn đã mượn sách này rồi.'], 400);
        }
        if ($userBorrowed) {
            return response()->json([
                'message' => 'Bạn đã mượn cuốn sách này rồi. Vui lòng trả sách trước khi mượn lại.'
            ], 403);
        }

        // 2. Kiểm tra số lần gia hạn của user này
        $totalRenewCount = BorrowRecord::where('user_id', $userId)
            ->where('is_return', false)
            ->sum('renew_count');

        if ($totalRenewCount >= 2) {
            return response()->json([
                'message' => 'Bạn đã sử dụng hết số lần gia hạn (tối đa 2 lần). Vui lòng trả sách trước khi mượn thêm.'
            ], 403);
        }

        // 3. Đếm số lượng sách chưa trả của user này
        $currentBorrowCount = BorrowRecord::where('user_id', $userId)
            ->where('is_return', false)
            ->count();

        if ($currentBorrowCount >= 3) {
            return response()->json([
                'message' => 'Bạn chỉ được mượn tối đa 3 sách cùng lúc. Vui lòng trả sách trước khi mượn thêm.'
            ], 403);
        }

        // 4. Tìm BookCopy còn available
        $availableCopy = BookCopy::where('id', $request->id_bookcopy)
            ->where('status', 'available')
            ->first();

        if (!$availableCopy) {
            return response()->json([
                'message' => 'Hiện không còn bản copy nào của sách này để mượn.'
            ], 404);
        }

        // 5. Tạo BorrowRecord
        $borrowRecord = BorrowRecord::create([
            'user_id' => $userId,
            'id_bookcopy' => $availableCopy->id,
            'start_time' => now(),
            'due_time' => now()->addDays(14),
            'renew_count' => 0,
            'is_return' => false,
            'is_extended_request' => false,
            'is_extended_approved' => 'pending',
        ]);

        $availableCopy->update([
            'status' => 'pending'
        ]);

        $this->logCreate('Phiếu mượn', ['user' => $borrowRecord->user->name, 'tên sách' => $borrowRecord->bookCopy->book->title]);
        return response()->json($borrowRecord, 201);
    }

    public function show($id)
    {
        return BorrowRecord::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $borrowRecord = BorrowRecord::findOrFail($id);
        $borrowRecord->update($request->all());
        return response()->json($borrowRecord, 200);
    }

    public function destroy($id)
    {
        BorrowRecord::destroy($id);
        return response()->json(null, 204);
    }

    public function history($userId)
    {
        $records = BorrowRecord::with('bookCopy.book')
            ->where('user_id', $userId)
            ->orderByDesc('start_time')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'id_bookcopy' => $record->id_bookcopy,
                    'title' => $record->bookCopy && $record->bookCopy->book ? $record->bookCopy->book->title : 'Không xác định',
                    'start_time' => $record->start_time,
                    'due_time' => $record->due_time,
                    'end_time' => $record->end_time,
                    'is_return' => $record->is_return,
                    'is_extended_request' => $record->is_extended_request,
                    'is_extended_approved' => $record->is_extended_approved,
                    'renew_count' => $record->renew_count,
                    'note' => $record->note,
                    'status' => $record->is_return
                        ? 'returned' 
                        : ($record->bookCopy->status === 'pending' ? 'pending' : 'borrowed'),
                ];
            });

        return response()->json($records);
    }

    public function renew(Request $request)
    {
        $userId = Auth::id();

        $borrowRecord = BorrowRecord::where('user_id', $userId)
            // ->where('id_bookcopy', $request->id_bookcopy)
            ->where('is_return', false)
            ->where('is_extended_request', false)
            ->first();

        if (!$borrowRecord) {
            return response()->json([
                'message' => 'Không tìm thấy phiếu mượn sách hoặc sách đã được trả.'
            ], 404);
        }

        if ($borrowRecord->renew_count >= 2) {
            return response()->json([
                'message' => 'Bạn đã sử dụng hết số lần gia hạn (tối đa 2 lần).'
            ], 403);
        }
           
        // Kiểm tra xem có quá hạn không
        if (now()->greaterThan($borrowRecord->due_time)) {
            return response()->json([
                'message' => 'Không thể gia hạn sách đã quá hạn. Vui lòng trả sách trước khi gia hạn.'
            ], 403);
        }

        $borrowRecord->update([
            'is_extended_request' => true,
        ]);

        return response()->json([
            'message' => 'Gia hạn sách thành công. Vui lòng chờ phê duyệt.',
            'new_due_date' => $borrowRecord->due_time,
            'renew_count' => $borrowRecord->renew_count,

        ], 200);
    }

    public function approveRenew(Request $request, $id)
    {
        $borrowRecord = BorrowRecord::findOrFail($id);
        $borrowRecord->update([
            'is_extended_approved' => 'approved',
            'due_time' => $borrowRecord->due_time->addDays(7),
        ]);

        $notification = Notification::create([
            'user_id' => $borrowRecord->user_id,
            'title' => 'Phê duyệt gia hạn sách',
            'message' => 'Phiếu mượn sách của bạn đã được phê duyệt. Vui lòng đến thư viện để nhận sách.',
            'type' => 'success',
        ]);

        return response()->json([
            'message' => 'Phê duyệt gia hạn sách thành công.',
        ], 200);
    }

    public function rejectRenew(Request $request, $id)
    {
        $borrowRecord = BorrowRecord::findOrFail($id);
        $borrowRecord->update([
            'is_extended_approved' => 'rejected',
            'note' => $request->note,
        ]);

        $notification = Notification::create([
            'user_id' => $borrowRecord->user_id,
            'title' => 'Từ chối gia hạn sách',
            'message' => 'Phiếu mượn sách của bạn đã bị từ chối. Lý do: ' . $request->note,
            'type' => 'warning',
        ]);
        
        return response()->json([
            'message' => 'Từ chối gia hạn sách thành công.',
        ], 200);
    }

    /**
     * Trả sách
     */
    public function returnBook($id)
    {
        $userId = Auth::id();

        // Tìm bản ghi mượn sách
        $borrowRecord = BorrowRecord::where('id', $id)
            ->where('user_id', $userId)
            ->where('is_return', false)
            ->first();

        if (!$borrowRecord) {
            return response()->json([
                'message' => 'Không tìm thấy phiếu mượn sách hoặc sách đã được trả.'
            ], 404);
        }

        // Cập nhật trạng thái trả sách
        $borrowRecord->update([
            'is_return' => true,
            'end_time' => now(),
        ]);

        // Cập nhật trạng thái book copy về available
        $bookCopy = BookCopy::find($borrowRecord->id_bookcopy);
        if ($bookCopy) {
            $bookCopy->update([
                'status' => 'available'
            ]);
        }

        return response()->json([
            'message' => 'Trả sách thành công.',
            'return_time' => $borrowRecord->end_time,
        ], 200);
    }

    public function rejectBorrowRecords(Request $request, $id)
    {
        $borrowRecord = BorrowRecord::findOrFail($id);
        $reason = $request->input('reason', 'Không có lý do');
        
        $borrowRecord->update([
            'is_return' => true,
            'note' => $reason,
        ]);

        $notification = Notification::create([
            'user_id' => $borrowRecord->user_id,
            'title' => 'Từ chối phiếu mượn sách',
            'message' => 'Phiếu mượn sách của bạn đã bị từ chối. Lý do: ' . $reason,
            'type' => 'warning',
        ]);

        return response()->json([
            'message' => 'Từ chối phiếu mượn sách thành công.',
        ], 200);
    }
}
