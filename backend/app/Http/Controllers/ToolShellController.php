<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tool;

class ToolShellController extends Controller
{
    public function runCommand(Request $request)
    {
        // Validasi input
        $request->validate(['command' => 'required|string']);

        $command = trim($request->input('command'));

        if (empty($command)) {
            return response()->json(['output' => 'Command kosong']);
        }

        // Ambil nama tool dari command
        $parts = explode(' ', $command);
        $toolName = strtolower($parts[0]);

        // Cek apakah tool tersimpan dan sudah terinstall
        $tool = Tool::where('name', $toolName)->first();

        if (!$tool) {
            return response()->json([
                'output' => "Error: Tool '$toolName' tidak dikenali."
            ]);
        }

        if (!$tool->is_installed) {
            return response()->json([
                'output' => "Error: Tool '$toolName' belum terinstall."
            ]);
        }

        try {
            // Jalankan command langsung via shell_exec()
            $output = [];
            $exitCode = 0;

            exec("wsl /bin/bash -c \"" . escapeshellcmd($command) . "\" 2>&1", $output, $exitCode);

            if ($exitCode === 0) {
                return response()->json([
                    'output' => implode("\n", $output)
                ]);
            } else {
                return response()->json([
                    'output' => "Gagal menjalankan perintah '$command':\n" . implode("\n", $output)
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'output' => "Terjadi kesalahan: " . $e->getMessage()
            ], 500);
        }
    }
}