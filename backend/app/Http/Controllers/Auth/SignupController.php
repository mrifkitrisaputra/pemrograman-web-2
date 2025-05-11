<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SignupController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Simpan user
        $user = User::create([
            'username' => $request->username,
            'name' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Generate link verifikasi
        $token = Str::random(60); // Token bisa disimpan ke kolom tambahan jika mau
        $url = url("/api/verify-email/" . $user->id . "?token=" . $token);

        // Kirim email
        Mail::to($user->email)->send(new VerifyEmail($url));

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your address.',
        ], 201);
    }
}