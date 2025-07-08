<?php

namespace App\Http\Controllers;

use App\Models\BorrowRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BorrowRecordController extends Controller
{
    public function index()
    {
        // Lấy tất cả borrow records cùng với user (độc giả) và bookCopy.book (sách)
        $records = BorrowRecord::with([
            'user', // người mượn
            'bookCopy.book', // bản sao sách và sách
        ])->get();

        $result = $records->map(function($r) {
            return [
                'id' => $r->id,
                'reader' => $r->user ? $r->user->name : '—',
                'bookTitle' => $r->bookCopy && $r->bookCopy->book ? $r->bookCopy->book->title : '—',
                'quantity' => 1, // mỗi phiếu là 1 bản copy, nếu có quantity thì lấy $r->quantity
                'borrowDate' => $r->start_time,
                'dueDate' => $r->due_time,
                'note' => $r->note,
                'returned' => $r->is_return == 1,
            ];
        });

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $userId = Auth::id(); // Lấy id user hiện tại

        // Đếm số lượng sách chưa trả của user này
        $currentBorrowCount = \App\Models\BorrowRecord::where('id_user', $userId)
            ->where('is_return', false)
            ->count();

        if ($currentBorrowCount >= 3) {
            return response()->json([
                'message' => 'Bạn chỉ được mượn tối đa 3 sách cùng lúc. Vui lòng trả sách trước khi mượn thêm.'
            ], 403);
        }

        // Nếu chưa vượt quá giới hạn, cho phép mượn
        $borrowRecord = BorrowRecord::create([
            'id_user' => $userId,
            'id_bookcopy' => $request->id_bookcopy,
            'start_time' => now(),
            'due_time' => now()->addDays(14),
            // ... các trường khác
        ]);

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
                    'title' => $record->bookCopy->book->title ?? '',
                    'start_time' => $record->start_time,
                    'due_time' => $record->due_time,
                    'end_time' => $record->end_time,
                ];
            });

        return response()->json($records);
    }
}
