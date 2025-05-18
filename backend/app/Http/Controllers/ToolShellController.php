<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tool;

class ToolShellController extends Controller
{
    public function runTool(Request $request)
    {
        $cmd = $request->query('cmd');

        if (!$cmd) {
            return response()->json(['error' => 'Command tidak boleh kosong'], 400);
        }

        // Ambil nama tool dari command
        $parts = explode(" ", $cmd);
        $toolName = $parts[0];

        // Cek apakah tool tersedia di database
        $tool = Tool::where('name', $toolName)->first();

        if (!$tool) {
            return response()->json([
                'error' => 'Tool tidak dikenali atau belum terdaftar'
            ], 403);
        }

        // Eksekusi perintah
        exec($cmd . " 2>&1", $output, $return_var);

        return response()->json([
            'command' => $cmd,
            'output' => implode("\n", $output),
            'success' => $return_var === 0
        ]);
    }
}
