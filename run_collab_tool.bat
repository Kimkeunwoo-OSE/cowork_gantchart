@echo off
setlocal

REM ===== Add Node to PATH =====
set "PATH=C:\Program Files\nodejs;%PATH%"

REM ===== Move to script directory =====
cd /d "%~dp0"

echo Starting backend and frontend servers...
echo Make sure MySQL is running before continuing.
pause

REM ===== BACKEND =====
cd backend

IF NOT EXIST "node_modules" (
  echo Installing backend dependencies...
  call npm install
)

echo Running prisma migrate...
call npx prisma migrate deploy

echo Starting NestJS server...
start "backend" cmd /k "cd /d %cd% && npm run start:dev"

REM ===== FRONTEND =====
cd ..\frontend

IF NOT EXIST "node_modules" (
  echo Installing frontend dependencies...
  call npm install
)

echo Starting Vite frontend...
start "frontend" cmd /k "cd /d %cd% && npm run dev"

echo Waiting for UI startup...
timeout /t 7 >nul

start "" http://localhost:5173

echo All services started. Press any key to close this window.
pause
