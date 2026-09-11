@echo off
setlocal
cd /d "%~dp0"

set "TARGET=%CD%\START_EXHIBITION.bat"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP%\Space Career Exhibition.lnk"

powershell -NoProfile -Command "$ws=New-Object -ComObject WScript.Shell; $s=$ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath='%TARGET%'; $s.WorkingDirectory='%CD%'; $s.WindowStyle=7; $s.Save()"
if errorlevel 1 (
  echo [ERROR] Could not create startup shortcut.
  pause
  exit /b 1
)

echo [OK] Exhibition will start automatically when this Windows user signs in.
echo Shortcut: %SHORTCUT%
pause
exit /b 0
