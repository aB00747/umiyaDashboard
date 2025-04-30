<?php
namespace App\Http\Middleware;

use Closure;
/**
 * Set CORS headers for API responses.
 *
 * This middleware is applied to the whole API group.
 */
class Cors
{
    /**
     * Handle an incoming request and set CORS headers.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return \Illuminate\Http\Response
     */

    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
    }
}