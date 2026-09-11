@echo off
setlocal
cd /d "%~dp0"

echo Stopping Space Career exhibition...

if exist .offline-server.pid (
  set /p SERVER_PID=<.offline-server.pid
  if defined SERVER_PID taskkill /PID %SERVER_PID% /T /F >nul 2>nul
  del /q .offline-server.pid >nul 2>nul
)

powershell -NoProfile -Command "$ps=Get-CimInstance Win32_Process | Where-Object { ($_.Name -match 'msedge|chrome') -and $_.CommandLine -like '*\.kiosk-profile*' }; foreach($p in $ps){ Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>nul

echo [OK] Exhibition stopped.
timeout /t 2 /nobreak >nul
exit /b 0
