# ============================================================
# watch.ps1 - Auto-pull from GitHub every 60 seconds
# Run this script once in a terminal to keep your local
# copy in sync with the remote GitHub repository.
# Usage: powershell -ExecutionPolicy Bypass -File watch.ps1
# ============================================================

$repoPath = $PSScriptRoot
$interval = 15  # seconds between checks

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " GitHub Auto-Pull Watcher - PQC Assessor" -ForegroundColor Cyan
Write-Host " Repo: $repoPath" -ForegroundColor Cyan
Write-Host " Polling every $interval seconds..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Add Git to PATH if needed
$env:PATH += ";C:\Program Files\Git\cmd"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    try {
        # Fetch remote changes silently
        $fetchResult = & git -C $repoPath fetch origin 2>&1

        # Check if there are new commits to pull
        $status = & git -C $repoPath status -uno 2>&1
        $statusText = $status -join " "

        if ($statusText -match "Your branch is behind") {
            Write-Host "[$timestamp] >> New changes detected! Pulling..." -ForegroundColor Yellow
            $pullResult = & git -C $repoPath pull origin 2>&1
            Write-Host ($pullResult -join "`n") -ForegroundColor Green
            Write-Host "[$timestamp] OK Pull complete." -ForegroundColor Green
        }
        elseif ($statusText -match "up to date") {
            Write-Host "[$timestamp] OK Already up to date." -ForegroundColor Gray
        }
        else {
            Write-Host "[$timestamp] -- Status: $statusText" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "[$timestamp] ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "    -> Make sure Git is installed and you are connected to the internet." -ForegroundColor Red
    }

    Start-Sleep -Seconds $interval
}
