# PowerShell script for automated daily GitHub commits
# This script will be run by Windows Task Scheduler

$projectPath = "c:\Users\YUVRAJ SINGH\Vault\Github\Graphs"
$logFile = "$projectPath\scheduler.log"

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logEntry
    Write-Host $logEntry
}

try {
    Write-Log "Starting scheduled daily commit task..."
    
    # Change to project directory
    Set-Location $projectPath
    Write-Log "Changed to directory: $projectPath"
    
    # Run the daily commit script
    Write-Log "Executing daily commit script..."
    $result = & node daily-commit.js 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Daily commit script completed successfully"
        Write-Log "Output: $result"
    } else {
        Write-Log "Daily commit script failed with exit code: $LASTEXITCODE"
        Write-Log "Error output: $result"
    }
    
} catch {
    Write-Log "PowerShell script error: $($_.Exception.Message)"
}

Write-Log "Scheduled task completed"
