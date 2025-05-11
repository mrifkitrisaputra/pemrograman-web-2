<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class LoginController extends Controller
{
    public function __invoke(Request $request)
    {
        // Validasi input dasar
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Cari user berdasarkan username
        $user = User::where('username', $request->username)->first();

        // Jika user tidak ditemukan atau password salah
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Invalid username or password.'
            ], 401);
        }

        // Cek apakah email sudah diverifikasi
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'error' => 'Please verify your email before logging in.'
            ], 403);
        }

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ],
        ]);
    }
}