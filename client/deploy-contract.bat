@echo off
REM Deploy contract to Hardhat node
echo.
echo 📝 Deploying Upload contract to localhost...
echo.

cd /d "%~dp0"
npx hardhat run scripts/deploy.js --network localhost

echo.
echo ✅ Deployment complete!
echo.
pause
