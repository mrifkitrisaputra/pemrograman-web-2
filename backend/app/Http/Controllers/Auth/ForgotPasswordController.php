<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'User with this email does not exist.'
            ], 404);
        }

        // Generate token
        $token = Str::random(60);

        // Hapus token lama
        DB::table('password_resets')->where('email', $request->email)->delete();

        // Simpan token baru
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => now(),
        ]);

        // Buat URL reset
        $resetUrl = env('FRONTEND_URL') . "/reset-password?token={$token}&email={$user->email}";

        // Kirim email
        Mail::to($user->email)->send(new ResetPasswordMail($resetUrl));

        return response()->json(['message' => 'Password reset link has been sent to your email.']);
    }
}