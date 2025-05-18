<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\SignupController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\ForgotPasswordController;

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

//tools
Route::get('/tools', [ToolController::class, 'index']);
Route::post('/tools', [ToolController::class, 'toolStore']);
Route::get('/tools/{tool}', [ToolController::class, 'show']);
Route::put('/tools/{tool}', [ToolController::class, 'update']);
Route::delete('/tools/{tool}', [ToolController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

