@echo off
REM Complete development setup - starts blockchain, deploys contract, and starts React app
echo.
echo ================================
echo 🚀 SmartDrop Development Setup
echo ================================
echo.

cd /d "%~dp0"

echo ⚠️  This script will:
echo   1. Start Hardhat blockchain node
echo   2. Deploy the contract
echo   3. Start React development server
echo.
echo 💡 Three terminal windows will open. Keep all OPEN while developing.
echo.
pause

REM Open Terminal 1: Hardhat Node
echo Opening Terminal 1: Hardhat Node...
start "Hardhat Blockchain Node" cmd /k "cd /d %~dp0 && npx hardhat node"

REM Wait for node to start
echo Waiting for blockchain node to start (10 seconds)...
timeout /t 10 /nobreak

REM Open Terminal 2: Deploy Contract
echo Opening Terminal 2: Deploy Contract...
start "Deploy Contract" cmd /k "cd /d %~dp0 && npx hardhat run scripts/deploy.js --network localhost && echo. && echo ✅ Contract deployed! Note the address above && echo. && pause"

REM Wait for deployment
timeout /t 5 /nobreak

REM Open Terminal 3: React App
echo Opening Terminal 3: React App...
start "React Development Server" cmd /k "cd /d %~dp0 && npm start"

echo.
echo ✅ All terminals opened!
echo.
echo 📋 Next steps:
echo   1. Check Terminal 2 for contract address
echo   2. Update .env.local with the contract address
echo   3. Your app opens at http://localhost:3000
echo.
echo ⚠️  Keep all three terminals OPEN while developing
echo.
pause
