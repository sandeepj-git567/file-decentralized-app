# Start Hardhat node in background
Write-Host "🚀 Starting Hardhat blockchain node..." -ForegroundColor Green

# Kill any existing node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Hardhat node
$nodeProcess = Start-Process -NoNewWindow -PassThru -FilePath "npx" -ArgumentList "hardhat", "node" -WorkingDirectory $PSScriptRoot

Write-Host "✅ Hardhat node started (PID: $($nodeProcess.Id))" -ForegroundColor Green
Write-Host "⏳ Waiting for node to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Deploy contract
Write-Host "📝 Deploying contract..." -ForegroundColor Cyan
$deployOutput = & npx hardhat run scripts/deploy.js --network localhost 2>&1

if ($deployOutput -match "Contract deployed to: (0x[a-fA-F0-9]+)") {
    $contractAddress = $matches[1]
    Write-Host "✅ Contract deployed to: $contractAddress" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Update your .env.local with:" -ForegroundColor Yellow
    Write-Host "REACT_APP_CONTRACT_ADDRESS=$contractAddress" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host $deployOutput
}

Write-Host ""
Write-Host "🟢 Blockchain is ready on http://127.0.0.1:8545" -ForegroundColor Green
Write-Host "⚠️  Keep this window open while developing!" -ForegroundColor Yellow
Write-Host ""

# Keep node running
$nodeProcess | Wait-Process
