@echo off
setlocal
cd /d "%~dp0"

if not exist dist (
  echo [ERROR] dist folder not found. Run build-kiosk.bat first.
  pause
  exit /b 1
)

start "Projection Server" /min cmd /c "npm run preview"
timeout /t 2 /nobreak >nul

set KIOSK_URL=http://127.0.0.1:4173

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --kiosk %KIOSK_URL% --edge-kiosk-type=fullscreen --no-first-run
  exit /b 0
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --kiosk %KIOSK_URL% --edge-kiosk-type=fullscreen --no-first-run
  exit /b 0
)

start "" %KIOSK_URL%
exit /b 0
