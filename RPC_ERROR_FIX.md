# 🔧 Fix RPC Error - Setup Guide

## ❌ Error You Got:
```
RPC endpoint returned too many errors, retrying in 0.5 minutes
```

**Cause:** Your Hardhat blockchain node isn't running or crashed.

---

## ✅ Solution: Restart Everything

### Step 1: Start the Blockchain Node

**Windows (Easiest):**
```
Double-click: start-hardhat-node.bat
```

**Or in PowerShell:**
```powershell
cd client
npx hardhat node
```

✅ You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
```

**⚠️ IMPORTANT:** Keep this terminal/window OPEN! The node must keep running.

---

### Step 2: Deploy Contract (In a NEW Terminal)

**Windows (Easiest):**
```
Double-click: deploy-contract.bat
```

**Or in PowerShell:**
```powershell
cd client
npx hardhat run scripts/deploy.js --network localhost
```

✅ You should see:
```
Compiled 1 Solidity file successfully
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

### Step 3: Update `.env.local`

Copy the contract address from deployment output and update:

```
C:\Users\Admin\Downloads\File-Storage-System-master\File-Storage-System-master\client\.env.local
```

Update:
```
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK=localhost
```

---

### Step 4: Start React App (In ANOTHER Terminal)

```powershell
cd client
npm start
```

---

## 📋 Terminal Setup Summary

You need **3 terminals open** while developing:

| Terminal 1 | Terminal 2 | Terminal 3 |
|-----------|-----------|-----------|
| **Blockchain** | **Deploy** | **React App** |
| `npx hardhat node` | `npx hardhat run scripts/deploy.js --network localhost` | `npm start` |
| Keep running | Run once | Keep running |
| Port: 8545 | One-time | Port: 3000 |

---

## 🔍 Troubleshooting

### "Cannot connect to localhost"
→ **Terminal 1 (Hardhat node) is not running!**
→ Make sure `npx hardhat node` is still active

### "Contract not found"
→ **Contract wasn't deployed!**
→ Run `npx hardhat run scripts/deploy.js --network localhost` in Terminal 2

### "Still getting RPC errors in the app"
→ **Contract address is wrong in `.env.local`**
→ Update `REACT_APP_CONTRACT_ADDRESS` with the address from deployment

### Hardhat node keeps crashing
→ Kill all node processes and restart:
```powershell
Stop-Process -Name node -Force
npx hardhat node
```

---

## 🧪 Quick Test

Once everything is running:

1. Open http://localhost:3000
2. Connect MetaMask to **Localhost 8545** (custom network)
3. Try uploading a file
4. Should NOT see the RPC error

---

## 📝 .env.local Template

Create/update this file in `client/` folder:

```
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK=localhost
```

---

## 💡 Pro Tips

- **Always start Hardhat node FIRST** before deploying
- **Keep all 3 terminals open** while coding
- **Don't close the Hardhat node terminal** - it stops the blockchain
- If something breaks, **restart Hardhat node** (Terminal 1)

---

Done! Your RPC error should be fixed. 🎉
