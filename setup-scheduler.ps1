# Setup script to create Windows Task Scheduler task for daily GitHub commits
# Run this script as Administrator in PowerShell

$taskName = "GitHub Daily Commits"
$scriptPath = "c:\Users\YUVRAJ SINGH\Vault\Github\Graphs\daily-commit-scheduler.ps1"
$projectPath = "c:\Users\YUVRAJ SINGH\Vault\Github\Graphs"

Write-Host "Setting up Windows Task Scheduler for daily GitHub commits..." -ForegroundColor Green

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Task '$taskName' already exists. Removing it first..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create the scheduled task
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`"" -WorkingDirectory $projectPath

# Set trigger for daily execution at 2 PM (you can change this time)
$trigger = New-ScheduledTaskTrigger -Daily -At "2:00 PM"

# Set additional triggers for multiple times per day (optional)
$trigger2 = New-ScheduledTaskTrigger -Daily -At "6:00 PM"
$trigger3 = New-ScheduledTaskTrigger -Daily -At "10:00 PM"

# Combine all triggers
$triggers = @($trigger, $trigger2, $trigger3)

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5)

# Create principal (run as current user)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

try {
    # Register the scheduled task
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $triggers -Settings $settings -Principal $principal -Description "Automatically generates daily GitHub contribution commits"
    
    Write-Host "`nTask '$taskName' has been created successfully!" -ForegroundColor Green
    Write-Host "The task will run daily at:" -ForegroundColor Cyan
    Write-Host "  - 2:00 PM" -ForegroundColor White
    Write-Host "  - 6:00 PM" -ForegroundColor White  
    Write-Host "  - 10:00 PM" -ForegroundColor White
    Write-Host "`nYou can modify the schedule in Task Scheduler (taskschd.msc)" -ForegroundColor Yellow
    Write-Host "`nTo test the task immediately, run:" -ForegroundColor Cyan
    Write-Host "Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
    
} catch {
    Write-Host "Error creating scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure you're running PowerShell as Administrator" -ForegroundColor Yellow
}

# Test the script manually first
Write-Host "`nTesting the daily commit script now..." -ForegroundColor Green
Set-Location $projectPath
& node daily-commit.js

Write-Host "`nSetup completed! Check the logs in:" -ForegroundColor Green
Write-Host "$projectPath\daily-commits.log" -ForegroundColor White
Write-Host "$projectPath\scheduler.log" -ForegroundColor White
