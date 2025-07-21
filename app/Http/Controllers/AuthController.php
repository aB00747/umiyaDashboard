<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login and token creation
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
            'device_name' => 'nullable|string',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();

            $request->session()->regenerate();

            $deviceName = $request->device_name ?? $request->userAgent() ?? 'API Token';

            $tokenResult = $user->createToken($deviceName);

            if ($remember) {
                // Set longer expiration for remember me (e.g., 30 days)
                $tokenResult->accessToken->expires_at = now()->addDays(30);
                $tokenResult->accessToken->save();
            }

            return response()->json([
                'user' => $user,
                'token' => $tokenResult->plainTextToken,
                'token_type' => 'Bearer',
                'remember' => $remember,
                'expires_at' => $tokenResult->accessToken->expires_at,
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Alternative implementation with manual user lookup
     */
    public function loginAlternative(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
            'device_name' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $remember = $request->boolean('remember');

        // ✅ Login with remember me
        Auth::login($user, $remember);
        $request->session()->regenerate();

        $deviceName = $request->device_name ?? $request->userAgent() ?? 'API Token';

        // ✅ Create token with conditional expiration
        $token = $user->createToken($deviceName, ['*'], $remember ? now()->addDays(30) : now()->addDay());

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'remember' => $remember,
        ]);
    }

    /**
     * Handle user logout
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        if (Auth::check()) {
            Auth::user()->remember_token = null;
            // Auth::user()->save();
        }

        // Delete current access token
        $request->user()->currentAccessToken()->delete();

        // Logout from web guard
        Auth::guard('web')->logout();

        // Invalidate session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
