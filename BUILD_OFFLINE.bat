@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  SPACE CAREER - BUILD OFFLINE PACKAGE
echo ========================================

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js LTS 20+ first.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm not found.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/3] Installing dependencies...
  call npm install
  if errorlevel 1 goto :fail
) else (
  echo [1/3] Dependencies already installed.
)

echo [2/3] Building production files...
call npm run build
if errorlevel 1 goto :fail

if not exist dist\offline-content.json (
  echo [ERROR] offline-content.json was not copied to dist.
  goto :fail
)

echo [3/3] Build verification...
if not exist dist\index.html goto :fail
if not exist dist\maintenance.html goto :fail
if not exist dist\offline-runtime.js goto :fail

echo.
echo [OK] Offline build is ready in: %CD%\dist
echo [INFO] Future media can be changed inside dist\ and dist\offline-content.json without rebuilding.
echo [INFO] Run START_EXHIBITION.bat to test.
echo.
pause
exit /b 0

:fail
echo.
echo [ERROR] Offline build failed. Check the messages above.
pause
exit /b 1
