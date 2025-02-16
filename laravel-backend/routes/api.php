<?php

echo "API Routes Loaded\n"; // Debugging langsung ke terminal

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;

Route::post('/signup', [RegisterController::class, 'register']);