<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SignupController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\LogoutController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are typically stateless.
|
*/

// Public Auth Routes
Route::post('/signup', SignupController::class);
Route::post('/login', LoginController::class, '__invoke');
Route::post('/logout', [LogoutController::class, 'logout']);

// Password Reset Routes
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::get('/check-reset-token', [ResetPasswordController::class, 'checkToken']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// Email Verification Route
Route::get('/verify-email/{id}', VerifyEmailController::class);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

