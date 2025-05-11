<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id)
    {

        $token = $request->query('token');

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '/login');
        }

        $user->markEmailAsVerified();

        // Redirect ke frontend
        return redirect(env('FRONTEND_URL') . '/login');
    }
}
