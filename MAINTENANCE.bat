@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "KIOSK_PORT=4173"
if exist KIOSK_SETTINGS.bat call KIOSK_SETTINGS.bat
set "BASE_URL=http://127.0.0.1:%KIOSK_PORT%"
set "MAINT_URL=%BASE_URL%/maintenance.html"

if not exist dist\maintenance.html (
  echo [ERROR] Offline build not found. Run BUILD_OFFLINE.bat first.
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing '%BASE_URL%/__health' -TimeoutSec 1; if($r.StatusCode -eq 200){exit 0}else{exit 1} } catch { exit 1 }" >nul 2>nul
if errorlevel 1 (
  start "SpaceCareer Offline Server" /min cmd /c "cd /d \"%CD%\" && node tools\offline-server.mjs dist %KIOSK_PORT%"
  timeout /t 2 /nobreak >nul
)

set "BROWSER="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

if defined BROWSER (
  start "" "%BROWSER%" --new-window "%MAINT_URL%"
) else (
  start "" "%MAINT_URL%"
)
exit /b 0
