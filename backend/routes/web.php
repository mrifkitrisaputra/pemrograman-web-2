<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, '__invoke'])->middleware('web');

// Untuk CSRF cookie
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF Cookie Set']);
});

// Untuk cek user login
Route::get('/user', function (\Illuminate\Http\Request $request) {
    if ($request->user()) {
        return response()->json($request->user());
    }

    return response()->json(['authenticated' => false], 401);
});