@echo off
set "PATH=C:\Program Files\nodejs;C:\Program Files\MongoDB\Server\8.0\bin;C:\Program Files\MongoDB\Server\7.0\bin;C:\Program Files\MongoDB\Server\6.0\bin;%PATH%"
echo ================================================
echo  DBU Security Guard System - Dev Startup
echo ================================================

echo.
echo [1/4] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found.
    echo Download from: https://nodejs.org/en/download
    pause
    exit /b 1
)
node -v

echo.
echo [2/4] Checking MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo MongoDB service not found, trying to start mongod manually...
    mongod --version >nul 2>&1
    if errorlevel 1 (
        echo WARNING: MongoDB not found. Install it with: choco install mongodb
        echo Backend will retry connection 5 times then start anyway.
    ) else (
        echo Starting MongoDB manually...
        if not exist "C:\data\db" mkdir "C:\data\db"
        start /min "MongoDB" mongod --dbpath "C:\data\db"
        timeout /t 3 /nobreak >nul
    )
) else (
    sc start MongoDB >nul 2>&1
    echo MongoDB service started.
)

echo.
echo [3/4] Installing dependencies (if needed)...
cd backend
if not exist node_modules (
    npm install
)
cd ..\frontend
if not exist node_modules (
    npm install
)
cd ..

echo.
echo ================================================
echo  Starting backend on http://localhost:5000
echo  Starting frontend on http://localhost:3000
echo ================================================
echo.

start "DBU Backend" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "DBU Frontend" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd frontend && npm run dev"

echo.
echo Both servers started in separate windows!
echo.
echo  LOGIN CREDENTIALS:
echo   Admin:  admin@dbu.edu.et  /  password123
echo   Guard:  guard@dbu.edu.et  /  password123
echo   Guest:  guest@dbu.edu.et  /  password123
echo.
echo  Open http://localhost:3000 in your browser.
pause
