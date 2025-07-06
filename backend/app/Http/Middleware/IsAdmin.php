<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra user đã đăng nhập và có role là admin
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }
        // Nếu không phải admin, chuyển hướng hoặc trả về lỗi
        abort(403, 'Bạn không có quyền truy cập trang này.');
    }
}
