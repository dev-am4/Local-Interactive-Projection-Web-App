@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm not found. Install Node.js LTS first.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :fail
)

echo Building kiosk app...
call npm run build
if errorlevel 1 goto :fail

echo.
echo Build complete: dist\
pause
exit /b 0

:fail
echo.
echo [ERROR] Build failed.
pause
exit /b 1
