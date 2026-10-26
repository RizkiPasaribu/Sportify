<?php

use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\VenueController as AdminVenueController;
use App\Http\Controllers\Customer\BookingController as CustomerBookingController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\VenueController as CustomerVenueController;
use App\Http\Controllers\Owner\BookingController as OwnerBookingController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Owner\FieldController;
use App\Http\Controllers\Owner\ReportController;
use App\Http\Controllers\Owner\VenueManagementController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/venues', [CustomerVenueController::class, 'index'])->name('venues.index');
Route::get('/venues/{venue}', [CustomerVenueController::class, 'show'])->name('venues.show');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn (Request $request) => redirect()->route($request->user()->homeRoute()))
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:customer'])
    ->prefix('customer')
    ->name('customer.')
    ->group(function () {
        Route::get('/dashboard', CustomerDashboardController::class)->name('dashboard');

        Route::get('/bookings', [CustomerBookingController::class, 'index'])->name('bookings.index');
        Route::post('/fields/{field}/bookings', [CustomerBookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/{booking}', [CustomerBookingController::class, 'show'])->name('bookings.show');
        Route::post('/bookings/{booking}/pay', [CustomerBookingController::class, 'pay'])->name('bookings.pay');
        Route::post('/bookings/{booking}/cancel', [CustomerBookingController::class, 'cancel'])->name('bookings.cancel');
        Route::post('/bookings/{booking}/review', [CustomerBookingController::class, 'review'])->name('bookings.review');
    });

Route::middleware(['auth', 'role:owner'])
    ->prefix('owner')
    ->name('owner.')
    ->group(function () {
        Route::get('/dashboard', OwnerDashboardController::class)->name('dashboard');

        Route::resource('venues', VenueManagementController::class)->except(['show']);

        Route::get('/venues/{venue}/fields', [FieldController::class, 'index'])->name('venues.fields.index');
        Route::get('/venues/{venue}/fields/create', [FieldController::class, 'create'])->name('venues.fields.create');
        Route::post('/venues/{venue}/fields', [FieldController::class, 'store'])->name('venues.fields.store');
        Route::get('/venues/{venue}/fields/{field}/edit', [FieldController::class, 'edit'])->name('venues.fields.edit');
        Route::put('/venues/{venue}/fields/{field}', [FieldController::class, 'update'])->name('venues.fields.update');
        Route::delete('/venues/{venue}/fields/{field}', [FieldController::class, 'destroy'])->name('venues.fields.destroy');

        Route::get('/bookings', [OwnerBookingController::class, 'index'])->name('bookings.index');
        Route::post('/bookings/{booking}/confirm', [OwnerBookingController::class, 'confirm'])->name('bookings.confirm');
        Route::post('/bookings/{booking}/cancel', [OwnerBookingController::class, 'cancel'])->name('bookings.cancel');
        Route::post('/bookings/{booking}/complete', [OwnerBookingController::class, 'complete'])->name('bookings.complete');

        Route::get('/reports', ReportController::class)->name('reports.index');
    });

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

        Route::get('/venues', [AdminVenueController::class, 'index'])->name('venues.index');
        Route::delete('/venues/{venue}', [AdminVenueController::class, 'destroy'])->name('venues.destroy');

        Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
        Route::post('/bookings/{booking}/cancel', [AdminBookingController::class, 'cancel'])->name('bookings.cancel');
    });

require __DIR__.'/auth.php';
