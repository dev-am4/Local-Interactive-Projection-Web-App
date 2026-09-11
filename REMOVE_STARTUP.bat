@echo off
setlocal
set "SHORTCUT=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Space Career Exhibition.lnk"
if exist "%SHORTCUT%" del /q "%SHORTCUT%"
echo [OK] Automatic startup removed.
pause
exit /b 0
