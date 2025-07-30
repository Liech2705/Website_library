<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Traits\AdminActivityLogger;


class UserController extends Controller
{
    use AdminActivityLogger;

    public function index()
    {
        $users = User::with('userInfo')->get();

        // Format lại dữ liệu cho đúng yêu cầu
        $result = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'lock_until' => $user->lock_until,
                'id_infor' => $user->infor?->id,
                'infor' => $user->infor ? [
                    'phone' => $user->infor->phone,
                    'address' => $user->infor->address,
                    'school_name' => $user->infor->school_name,
                ] : null,
            ];
        });
    
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $user = User::create($request->all());
        $this->logCreate('Người dùng', ['name' => $user->name, 'id' => $user->id]);
        return response()->json($user, 201);
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        $this->logUpdate('Người dùng', $id, ['name' => $user->name]);
        return response()->json($user, 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        $this->logDelete('Người dùng', $id);
        return response()->json(null, 204);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'oldPassword' => 'required',
            'newPassword' => 'required|min:6',
        ]);

        $user = $request->user();

        if (!Hash::check($request->oldPassword, $user->password)) {
            return response()->json(['error' => 'Mật khẩu hiện tại không đúng.'], 422);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['success' => true]);
    }

    public function checkEmailExists($email)
    {
        $user = User::where('email', $email)->first();
        return response()->json(['exists' => $user !== null]);
    }
}
