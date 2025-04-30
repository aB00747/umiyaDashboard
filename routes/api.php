<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CustomerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
// Route::post('/login', [AuthController::class, 'login']);
Route::post('/login', [AuthController::class, 'login'])->middleware(['web']);
Route::get('/search-public', [SearchController::class, 'search']);

// Protected routes (authentication required)
Route::middleware(['auth:sanctum'])->group(function () {
    // User authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Search API
    Route::get('/search', [SearchController::class, 'search']);

    // Notifications API
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // Customer API
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'getAll']);
        Route::get('/{id}', [CustomerController::class, 'getById']);
        Route::post('/', [CustomerController::class, 'create']);
        Route::put('/{id}', [CustomerController::class, 'update']);
        Route::delete('/{id}', [CustomerController::class, 'delete']);
        Route::get('/search', [CustomerController::class, 'search']);
    });
});
