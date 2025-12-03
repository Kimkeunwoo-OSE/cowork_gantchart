@echo off
REM ============================================================
REM One-click runner for cowork-gantt (Windows CMD)
REM Prerequisites:
REM   - MySQL service is already running
REM   - backend/.env and frontend/.env are filled manually
REM     backend:  DATABASE_URL, JWT_SECRET
REM     frontend: VITE_API_BASE_URL (e.g. http://localhost:3000)
REM ============================================================

REM Ensure we operate from the repository root
cd /d "%~dp0"
setlocal ENABLEDELAYEDEXPANSION

REM Make sure Node.js is on PATH for typical Windows installs
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ------------------------------------------------------------
echo MySQL must be running before continuing.
echo If it is not running, please start the MySQL service now.
echo ------------------------------------------------------------
pause

REM ================= BACKEND =================
echo [BACKEND] Preparing backend (install -> migrate -> start)
cd backend
IF NOT EXIST "node_modules" (
  echo [BACKEND] Installing dependencies (first run may take a while)...
  npm install
)

REM Apply Prisma migrations
npx prisma migrate deploy

REM Start backend dev server in a new console
start "backend-server" cmd /k "cd /d %cd% && set PATH=%cd%\node_modules\.bin;%PATH% && npm run start:dev"

REM ================= FRONTEND =================
echo [FRONTEND] Preparing frontend (install -> dev server)
cd ..\frontend
IF NOT EXIST "node_modules" (
  echo [FRONTEND] Installing dependencies (first run may take a while)...
  npm install
)

REM Ensure local node_modules/.bin is prioritized for dev tools
set PATH=%cd%\node_modules\.bin;%PATH%

start "frontend-dev" cmd /k "cd /d %cd% && set PATH=%cd%\node_modules\.bin;%PATH% && npm run dev"

REM Give servers a few seconds to boot
echo Waiting for servers to start...
timeout /t 7 >nul

REM Open the frontend in the default browser
start "" "http://localhost:5173"

echo ------------------------------------------------------------
echo Servers are running. Close backend-server or frontend-dev windows to stop them.
echo Press any key in this window to exit.
echo ------------------------------------------------------------
pause
endlocal
