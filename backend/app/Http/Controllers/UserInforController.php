<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User_infor;

class UserInforController extends Controller
{
    // Lấy danh sách tất cả user_infors
    public function index()
    {
        $userInfors = User_infor::all();
        return response()->json($userInfors);
    }

    // Lấy thông tin user_infor theo id
    public function show($id)
    {
        $userInfor = User_infor::find($id);
        if (!$userInfor) {
            return response()->json(['error' => 'Không tìm thấy thông tin người dùng'], 404);
        }
        return response()->json($userInfor);
    }

    // Tạo mới user_infor
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'phone' => 'required|string',
            'address' => 'nullable|string',
            'image_url' => 'nullable|string',
            'school_name' => 'nullable|string',
        ]);
        $userInfor = User_infor::create($validated);
        return response()->json($userInfor, 201);
    }

    // Cập nhật user_infor
    public function update(Request $request, $id)
    {
        $userInfor = User_infor::find($id);
        if (!$userInfor) {
            return response()->json(['error' => 'Không tìm thấy thông tin người dùng'], 404);
        }
        $validated = $request->validate([
            'phone' => 'sometimes|required|string',
            'address' => 'nullable|string',
            'image_url' => 'nullable|string',
            'school_name' => 'nullable|string',
        ]);
        $userInfor->update($validated);
        return response()->json($userInfor);
    }

    // Xóa user_infor
    public function destroy($id)
    {
        $userInfor = User_infor::find($id);
        if (!$userInfor) {
            return response()->json(['error' => 'Không tìm thấy thông tin người dùng'], 404);
        }
        $userInfor->delete();
        return response()->json(['message' => 'Xóa thành công']);
    }
}
