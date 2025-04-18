<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/profile', function () {
            return Inertia::render('Profile/Edit');
        })->name('profile.edit');

        // Add new routes for sidebar navigation
        Route::get('/customers', function () {
            return Inertia::render('Customers/Index');
        })->name('customers.index');
        
        Route::get('/inventory', function () {
            return Inertia::render('Inventory/Index');
        })->name('inventory.index');
        
        Route::get('/orders', function () {
            return Inertia::render('Orders/Index');
        })->name('orders.index');
        
        Route::get('/pricing', function () {
            return Inertia::render('Pricing/Index');
        })->name('pricing.index');
        
        Route::get('/deliveries', function () {
            return Inertia::render('Deliveries/Index');
        })->name('deliveries.index');
        
        Route::get('/messaging', function () {
            return Inertia::render('Messaging/Index');
        })->name('messaging.index');
        
        Route::get('/reports', function () {
            return Inertia::render('Reports/Index');
        })->name('reports.index');
        
        Route::get('/documents', function () {
            return Inertia::render('Documents/Index');
        })->name('documents.index');
        
        Route::get('/settings', function () {
            return Inertia::render('Settings/Index');
        })->name('settings.index');
});

require __DIR__.'/auth.php';
