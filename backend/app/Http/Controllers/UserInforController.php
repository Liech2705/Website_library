<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User_infor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
            'avatar' => 'nullable|string',
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
            'avatar' => 'nullable|string',
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

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $data = $request->validate([
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'school_name' => 'nullable|string|max:255',
        ]);
        $userInfor = User_infor::where('user_id', $user->id)->first();
        if (!$userInfor) {
            // Nếu chưa có thì tạo mới
            $data['user_id'] = $user->id;
            $userInfor = User_infor::create($data);
        } else {
            $userInfor->update($data);
        }
        return response()->json(['message' => 'Cập nhật thông tin thành công!', 'user_infor' => $userInfor]);
    }

    public function updateAvatar(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $userInfor = User_infor::where('user_id', $user->id)->first();
        if (!$userInfor) {
            return response()->json(['message' => 'User info not found'], 404);
        }
        $path = $request->file('avatar')->store('avatars', 'public');
        if ($userInfor->avatar) {
            Storage::disk('public')->delete($userInfor->avatar);
        }
        $userInfor->avatar = $path;
        $userInfor->save();
        return response()->json(['avatar' => $path, 'url' => asset('storage/' . $path)]);
    }

    public function getMyInfor()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $userInfor = User_infor::where('user_id', $user->id)->first();
        return response()->json($userInfor);
    }

    public function getInforByUserId($userId)
    {
        $userInfor = User_infor::where('user_id', $userId)->first();
        if (!$userInfor) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($userInfor);
    }
}
