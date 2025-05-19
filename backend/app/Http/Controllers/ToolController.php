<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ToolController extends Controller
{
    // Daftar pola perintah yang diizinkan (whitelist)
    protected $allowedPatterns = [
        '/^sudo\s+apt\s+install\s+[a-zA-Z0-9\-\_\.]+$/i',
        '/^apt\s+update$/i',
        '/^apt\s+upgrade(\s+-y)?$/i',
        '/^apt\s+remove\s+[a-zA-Z0-9\-\_\.]+$/i',
        '/^apt\s+purge\s+[a-zA-Z0-9\-\_\.]+$/i',
        '/^sudo\s+apt-get\s+install\s+[a-zA-Z0-9\-\_\.]+$/i',
    ];

    protected function isCommandAllowed(string $command): bool
    {
        foreach ($this->allowedPatterns as $pattern) {
            if (preg_match($pattern, $command)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tools = Tool::all();

        return response()->json([
            'status' => 'success',
            'data' => $tools
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:tools,name',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'installation_command' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $tool = Tool::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'installation_command' => $validated['installation_command']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tool berhasil ditambahkan',
            'data' => $tool
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($toolName)
    {
        $tool = is_numeric($toolName)
            ? Tool::find($toolName)
            : Tool::where('name', $toolName)->first();

        if (!$tool) {
            return response()->json([
                'status' => 'error',
                'message' => "Tool '$toolName' tidak ditemukan"
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $tool
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $toolName)
    {
        $tool = is_numeric($toolName)
            ? Tool::find($toolName)
            : Tool::where('name', $toolName)->first();

        if (!$tool) {
            return response()->json([
                'status' => 'error',
                'message' => "Tool '$toolName' tidak ditemukan"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|unique:tools,name,' . $tool->id,
            'category' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
            'installation_command' => 'sometimes|required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $tool->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Tool berhasil diperbarui',
            'data' => $tool
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($toolName)
    {
        $tool = is_numeric($toolName)
            ? Tool::find($toolName)
            : Tool::where('name', $toolName)->first();

        if (!$tool) {
            return response()->json([
                'status' => 'error',
                'message' => "Tool '$toolName' tidak ditemukan"
            ], 404);
        }

        $tool->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Tool '$toolName' berhasil dihapus"
        ], 204);
    }

    /**
     * Execute a WSL command with whitelist check.
     */
    public function executeWSL(Request $request)
    {
        $command = trim($request->input('command'));

        if (empty($command)) {
            return response()->json([
                'success' => false,
                'error' => 'Command tidak boleh kosong'
            ], 400);
        }

        if (!$this->isCommandAllowed($command)) {
            return response()->json([
                'success' => false,
                'error' => 'Perintah tidak diizinkan demi alasan keamanan'
            ], 403);
        }

        try {
            $output = [];
            $exitCode = 0;
            exec("wsl " . escapeshellcmd($command) . " 2>&1", $output, $exitCode);

            if ($exitCode === 0) {
                return response()->json([
                    'success' => true,
                    'output' => implode("\n", $output)
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => implode("\n", $output) ?: 'Unknown error',
                    'exit_code' => $exitCode
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Terjadi kesalahan eksekusi: ' . $e->getMessage()
            ]);
        }
    }

    public function checkAndInstallTool(Request $request)
    {
        $tool = trim($request->input('tool'));

        if (empty($tool)) {
            return response()->json([
                'success' => false,
                'error' => 'Tool tidak boleh kosong'
            ], 400);
        }

        // Validasi nama tool
        if (!preg_match('/^[a-zA-Z0-9\-\_\.]+$/', $tool)) {
            return response()->json([
                'success' => false,
                'error' => 'Nama tool mengandung karakter tidak valid'
            ], 422);
        }

        try {
            // Cek apakah tool sudah terinstall
            $checkOutput = [];
            $checkExitCode = 0;
            exec("wsl dpkg -s {$tool} > /dev/null 2>&1", $checkOutput, $checkExitCode);

            if ($checkExitCode === 0) {
                // Tool sudah terinstall
                $toolModel = Tool::where('name', $tool)->first();
                if ($toolModel) {
                    $toolModel->update(['is_installed' => true]);
                }

                return response()->json([
                    'success' => true,
                    'message' => "Tool '$tool' sudah terinstall",
                    'installed' => true,
                    'output' => "Skipping installation..."
                ]);
            } else {
                // Install tool
                $installCommand = "sudo apt-get install -y {$tool}";
                if (!$this->isCommandAllowed($installCommand)) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Perintah instalasi tidak diizinkan'
                    ], 403);
                }

                $output = [];
                $exitCode = 0;
                exec("wsl sudo apt-get update && wsl {$installCommand} 2>&1", $output, $exitCode);

                if ($exitCode === 0) {
                    // Update is_installed = true
                    $toolModel = Tool::where('name', $tool)->first();
                    if ($toolModel) {
                        $toolModel->update(['is_installed' => true]);
                    }

                    return response()->json([
                        'success' => true,
                        'message' => "Tool '$tool' berhasil diinstal",
                        'installed' => true,
                        'output' => implode("\n", $output)
                    ]);
                } else {
                    return response()->json([
                        'success' => false,
                        'error' => "Gagal menginstal tool '$tool'",
                        'output' => implode("\n", $output),
                        'exit_code' => $exitCode
                    ]);
                }
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    public function getInstalledTools()
    {
        $tools = Tool::where('is_installed', true)->get();

        return response()->json([
            'success' => true,
            'data' => $tools
        ]);
    }
}
