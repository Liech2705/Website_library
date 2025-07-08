<?php

namespace App\Http\Controllers;

use App\Models\AdminActivity;
use Illuminate\Http\Request;

class AdminActivityController extends Controller
{
    /**
     * Lấy danh sách hoạt động admin
     */
    public function index()
    {
        $activities = AdminActivity::with('admin:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($activities);
    }

    /**
     * Lấy hoạt động của admin cụ thể
     */
    public function show($adminId)
    {
        $activities = AdminActivity::with('admin:id,name,email')
            ->where('id_admin', $adminId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($activities);
    }

    /**
     * Xóa lịch sử hoạt động (chỉ admin mới được xóa)
     */
    public function destroy($id)
    {
        $activity = AdminActivity::findOrFail($id);
        $activity->delete();

        // Ghi log việc xóa lịch sử
        AdminActivity::log("Admin đã xóa lịch sử hoạt động ID: {$id}");

        return response()->json(['message' => 'Đã xóa lịch sử hoạt động'], 200);
    }
}
