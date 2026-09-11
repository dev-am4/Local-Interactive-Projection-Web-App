@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "KIOSK_PORT=4173"
set "PROJECTOR_X=0"
set "PROJECTOR_Y=0"
if exist KIOSK_SETTINGS.bat call KIOSK_SETTINGS.bat

set "KIOSK_URL=http://127.0.0.1:%KIOSK_PORT%"
set "KIOSK_PROFILE=%CD%\.kiosk-profile"

if not exist dist\index.html (
  echo [ERROR] Offline build not found.
  echo Run BUILD_OFFLINE.bat first.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js LTS 20+.
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing '%KIOSK_URL%/__health' -TimeoutSec 1; if($r.StatusCode -eq 200){exit 0}else{exit 1} } catch { exit 1 }" >nul 2>nul
if errorlevel 1 (
  echo Starting local exhibition server...
  start "SpaceCareer Offline Server" /min cmd /c "cd /d \"%CD%\" && node tools\offline-server.mjs dist %KIOSK_PORT%"
)

echo Waiting for local server...
set READY=0
for /L %%I in (1,1,20) do (
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing '%KIOSK_URL%/__health' -TimeoutSec 1; if($r.StatusCode -eq 200){exit 0}else{exit 1} } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 (
    set READY=1
    goto :server_ready
  )
  timeout /t 1 /nobreak >nul
)

:server_ready
if "%READY%"=="0" (
  echo [ERROR] Local server did not start.
  pause
  exit /b 1
)

set "BROWSER="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

if not defined BROWSER (
  echo [WARN] Edge/Chrome not found. Opening default browser.
  start "" "%KIOSK_URL%"
  exit /b 0
)

echo Starting exhibition in kiosk mode...
start "" "%BROWSER%" --kiosk "%KIOSK_URL%" --no-first-run --disable-session-crashed-bubble --disable-features=Translate --autoplay-policy=no-user-gesture-required --user-data-dir="%KIOSK_PROFILE%" --window-position=%PROJECTOR_X%,%PROJECTOR_Y%
exit /b 0
