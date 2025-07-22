<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\User_infor;


class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:10',
            'email' => 'required|string|email|max:255|unique:users|regex:/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu\.vn$/',
            'password' => 'required|string|min:6',
        ]);

        $user_email = User::where('email', $request->email)->first();
        $user_phone = User_infor::where('phone', $request->phone)->first();

        if (!$user_email && !$user_phone) {
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            User_infor::create([
                'user_id' => $user->id,
                'phone' => $request->phone,
                'address' => null,
                'avatar' => null,
                'school_name' => null,
            ]);
        } else {
            return response()->json(['message' => 'Email hoặc số điện thoại đã tồn tại !'], 422);
        }


        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],

        ]);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Thông tin đăng nhập không đúng'], 401);
        }

        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }
}
