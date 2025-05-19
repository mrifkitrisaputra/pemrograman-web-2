<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tool;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;

class ToolShellController extends Controller
{
    // Jalankan perintah terminal seperti nmap, dig, dll.
    public function runTool(Request $request)
    {
        $cmd = $request->query('cmd');

        if (!$cmd) {
            return response()->json(['error' => 'Command tidak boleh kosong'], 400);
        }

        // Cek apakah tool tersedia
        $parts = explode(" ", $cmd);
        $toolName = $parts[0];

        $tool = Tool::where('name', $toolName)->first();

        if (!$tool) {
            return response()->json(['error' => "Tool '$toolName' tidak dikenali"], 403);
        }

        if (!$this->isSafeCommand($cmd)) {
            return response()->json(['error' => "Command tidak diizinkan"], 403);
        }

        // Jalankan command secara async
        $fullCmd = PHP_OS_FAMILY === 'Windows' ? "wsl " . $cmd : $cmd;

        Log::info("Menjalankan perintah: " . $fullCmd);

        Process::run($fullCmd . " 2>&1", function ($type, $output) use ($toolName) {
            if ($type === 'out') {
                Log::info("Output dari [$toolName]: " . $output);
            } else {
                Log::error("Error dari [$toolName]: " . $output);
            }
        });

        return response()->json([
            'command' => $cmd,
            'message' => 'Perintah sedang dijalankan di background',
            'status' => 'queued'
        ]);
    }

    private function isSafeCommand($cmd)
    {
        $allowedCommands = ['/^nmap\s/', '/^dig\s/', '/^curl\s/', '/^whois\s/'];

        foreach ($allowedCommands as $pattern) {
            if (preg_match($pattern, $cmd)) {
                return true;
            }
        }

        return false;
    }
}
