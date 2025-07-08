<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::all();
    }

    public function store(Request $request)
    {
        $notification = Notification::create($request->all());
        return response()->json($notification, 201);
    }

    public function show($id)
    {
        return Notification::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update($request->all());
        return response()->json($notification, 200);
    }

    public function destroy($id)
    {
        Notification::destroy($id);
        return response()->json(null, 204);
    }

    public function getByUser($userId)
    {
        // Nếu muốn chỉ cho user xem notification của chính mình:
        if (Auth::id() != $userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $notifications = \App\Models\Notification::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }
}
