# Function to forcefully kill processes by name and command line
function Kill-ProcessesByCommandLine {
    param (
        [string]$Keyword
    )

    # Get all processes
    $processes = Get-WmiObject Win32_Process

    foreach ($process in $processes) {
        try {
            # Get the command line of the process
            $commandLine = $process.CommandLine

            # Check if the command line contains the keyword
            if ($commandLine -match $Keyword) {
                Write-Host "Forcefully killing process with ID $($process.ProcessId) running command: $Keyword"
                Stop-Process -Id $process.ProcessId -Force
            }
        } catch {
            Write-Host "Failed to kill process with ID $($process.ProcessId): $_"
        }
    }
}

# Kill processes related to React (frontend)
Kill-ProcessesByCommandLine -Keyword "npm run dev"

# Kill processes related to Laravel (backend)
Kill-ProcessesByCommandLine -Keyword "php artisan serve"

# Kill Windows Terminal processes that are running the above commands
$terminalProcesses = Get-Process -Name WindowsTerminal -ErrorAction SilentlyContinue

foreach ($terminalProcess in $terminalProcesses) {
    try {
        Write-Host "Forcefully killing Windows Terminal process with ID $($terminalProcess.Id)"
        Stop-Process -Id $terminalProcess.Id -Force
    } catch {
        Write-Host "Failed to kill Windows Terminal process with ID $($terminalProcess.Id): $_"
    }
}

Write-Host "All related processes have been forcefully killed."