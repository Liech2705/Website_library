<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'error' => 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
            ], 401);
        }

        return redirect()->guest(route('login'));
    }

    public function render($request, Throwable $exception)
    {
        // Xử lý lỗi 403 trả về JSON cho API
        if ($exception instanceof HttpException) {
            if ($exception->getStatusCode() === 403 && ($request->expectsJson() || $request->is('api/*'))) {
                return response()->json([
                    'error' => 'Bạn không có quyền truy cập.'
                ], 403);
            }
        }
        return parent::render($request, $exception);
    }
}
