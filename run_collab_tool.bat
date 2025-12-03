@echo off
REM ===============================================
REM 협업툴 통합 실행 배치 스크립트 (Windows)
REM - MySQL이 사전에 실행 중이어야 합니다.
REM - backend/.env, frontend/.env 파일을 첫 설정 시 직접 채워주세요.
REM   예시)
REM     backend/.env   : DATABASE_URL="mysql://root:비밀번호@localhost:3306/collab_tool" && JWT_SECRET="임의의_비밀키"
REM     frontend/.env  : VITE_API_BASE_URL="http://localhost:3000"
REM ===============================================

REM (0) 배치 파일 위치로 이동
cd /d "%~dp0"

REM (1) MySQL 안내 및 일시 정지
echo [안내] MySQL 서버가 실행 중이어야 합니다. 실행되지 않았다면 먼저 MySQL 서비스를 시작하세요.
pause

REM (2) BACKEND 설정 및 실행
echo.
echo [BACKEND] 설정을 시작합니다...
cd backend
IF NOT EXIST "node_modules" (
  echo [BACKEND] node_modules가 없어 npm install을 진행합니다. 처음 한 번은 시간이 걸릴 수 있습니다.
  npm install
)

echo [BACKEND] Prisma 마이그레이션을 적용합니다 (npx prisma migrate deploy).
npx prisma migrate deploy

echo [BACKEND] NestJS 개발 서버를 새 콘솔 창에서 실행합니다.
start "backend-server" cmd /k "cd /d %cd% && npm run start:dev"

REM (3) FRONTEND 설정 및 실행
echo.
echo [FRONTEND] 설정을 시작합니다...
cd ..\frontend
IF NOT EXIST "node_modules" (
  echo [FRONTEND] node_modules가 없어 npm install을 진행합니다. 처음 한 번은 시간이 걸릴 수 있습니다.
  npm install
)

echo [FRONTEND] Vite 개발 서버를 새 콘솔 창에서 실행합니다.
start "frontend-dev" cmd /k "cd /d %cd% && npm run dev"

REM (4) 브라우저 자동 실행을 위해 잠시 대기 후 UI 열기
echo [INFO] 서버가 기동될 시간을 확보하기 위해 잠시 대기합니다...
timeout /t 7 >nul
start "" "http://localhost:5173"

REM (5) 마무리 안내 및 일시 정지
echo.
echo [완료] 협업툴이 실행 중입니다. backend-server / frontend-dev 콘솔 창을 닫으면 서비스가 종료됩니다.
echo 메인 창을 닫으려면 아무 키나 누르세요.
pause
