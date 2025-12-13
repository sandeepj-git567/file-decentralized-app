@echo off
REM SmartDrop Development Start Script for Windows

echo 🚀 Starting SmartDrop Development Environment...

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local not found. Creating from .env.example...
    copy .env.example .env.local
    echo ✅ .env.local created. Please update with your contract address.
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
)

REM Start the development server
echo 🌐 Starting React development server...
call npm start
