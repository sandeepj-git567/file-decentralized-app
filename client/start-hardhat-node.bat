@echo off
REM Start Hardhat blockchain node
echo.
echo 🚀 Starting Hardhat blockchain node...
echo.

cd /d "%~dp0"
npx hardhat node

pause
