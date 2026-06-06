$ErrorActionPreference = "Stop"

$demoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $demoDir "..")
$mainVideo = Join-Path $demoDir "project_demo.mp4"
$cmdIntro = Join-Path $demoDir "cmd_intro_real.mp4"
$mergedVideo = Join-Path $demoDir "project_demo_real_cmd.mp4"
$introSeconds = 18

function Find-Ffmpeg {
    $candidates = @(
        $env:FFMPEG_PATH,
        (Join-Path $env:TEMP "codex-ffmpeg-tools\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"),
        "ffmpeg"
    ) | Where-Object { $_ }

    foreach ($candidate in $candidates) {
        try {
            & $candidate -version *> $null
            return $candidate
        } catch {
            # Try next candidate.
        }
    }

    throw "ffmpeg is not available. Install ffmpeg or set FFMPEG_PATH."
}

if (-not (Test-Path $mainVideo)) {
    throw "Missing $mainVideo. Run demo\record_demo.js first."
}

$ffmpeg = Find-Ffmpeg
if (Test-Path $cmdIntro) {
    Remove-Item -LiteralPath $cmdIntro -Force
}
if (Test-Path $mergedVideo) {
    Remove-Item -LiteralPath $mergedVideo -Force
}

$cmdLine = '/k "title SecureMonitor OS Startup && color 0A && mode con: cols=155 lines=40 && echo C:\Users\52697\Desktop^> cd /d C:\Users\52697\secure-monitor && cd /d C:\Users\52697\secure-monitor && echo C:\Users\52697\secure-monitor^> docker compose up -d && docker compose up -d && echo. && echo C:\Users\52697\secure-monitor^> docker compose ps && docker compose ps && echo. && echo Console: http://127.0.0.1:7001 && echo Prometheus: http://127.0.0.1:9090  Grafana: http://127.0.0.1:3000 && echo. && echo Startup commands are complete. The demo will open SecureMonitor OS next."'

$cmdProc = Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -WindowStyle Maximized -PassThru
Start-Sleep -Milliseconds 1200

$recordArgs = @(
    "-y",
    "-f", "gdigrab",
    "-framerate", "25",
    "-t", [string]$introSeconds,
    "-i", "desktop",
    "-vf", "scale=1366:768,format=yuv420p",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-movflags", "+faststart",
    "-an",
    $cmdIntro
)

$ffProc = Start-Process -FilePath $ffmpeg -ArgumentList $recordArgs -WindowStyle Hidden -PassThru
if (-not $ffProc.HasExited) {
    $null = $ffProc.WaitForExit(30000)
}

Start-Sleep -Milliseconds 300
if (-not $cmdProc.HasExited) {
    $null = $cmdProc.CloseMainWindow()
}

$mergeArgs = @(
    "-y",
    "-i", $cmdIntro,
    "-ss", [string]$introSeconds,
    "-i", $mainVideo,
    "-filter_complex", "[0:v:0][1:v:0]concat=n=2:v=1:a=0[v]",
    "-map", "[v]",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "20",
    "-movflags", "+faststart",
    "-an",
    $mergedVideo
)

& $ffmpeg @mergeArgs
Move-Item -Force -LiteralPath $mergedVideo -Destination $mainVideo

Get-Item $mainVideo | Select-Object FullName, Length, LastWriteTime
