$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ExporterScript = Join-Path $PSScriptRoot "windows_host_metrics_exporter.py"
$Python = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if (-not (Test-Path $Python)) {
  $Python = "python"
}

$existing = Get-NetTCPConnection -LocalPort 9182 -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Windows host metrics exporter is already listening on http://127.0.0.1:9182"
  exit 0
}

Start-Process -FilePath $Python -ArgumentList "`"$ExporterScript`"" -WorkingDirectory $ProjectRoot -WindowStyle Hidden
Start-Sleep -Seconds 2

try {
  Invoke-RestMethod -Uri "http://127.0.0.1:9182/health" -TimeoutSec 5 | Out-Null
  Write-Host "Windows host metrics exporter started: http://127.0.0.1:9182"
} catch {
  Write-Error "Failed to start Windows host metrics exporter: $($_.Exception.Message)"
  exit 1
}
