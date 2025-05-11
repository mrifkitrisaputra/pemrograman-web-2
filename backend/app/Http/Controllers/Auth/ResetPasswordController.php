<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    public function checkToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email'
        ]);

        $resetData = DB::table('password_resets')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$resetData) {
            return response()->json([
                'error' => 'Invalid or expired token.'
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Token is valid. You can reset your password.',
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $resetData = DB::table('password_resets')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$resetData) {
            return response()->json([
                'error' => 'Invalid or expired token.'
            ], 400);
        }

        // Update password user
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Hapus token setelah dipakai
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password successfully reset.']);
    }
}
