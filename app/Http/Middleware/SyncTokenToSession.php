<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SyncTokenToSession
{
    public function handle(Request $request, Closure $next)
    {
        // If a user is authenticated via token but not session
        if (!Auth::check() && $request->user('sanctum')) {
            Auth::login($request->user('sanctum'));
        }

        return $next($request);
    }
}