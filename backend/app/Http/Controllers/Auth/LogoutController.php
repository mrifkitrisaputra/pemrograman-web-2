<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    function logout (Request $request)
    {
        if (Auth::check()) {
            $request->user()->tokens()->delete();
        }

        return response()->json(['message' => 'logout success']);
    }
}
