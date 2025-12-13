# 🎯 Quick Start - RPC Error Fixed!

## The Problem ❌
Your Hardhat blockchain node crashed/stopped, so MetaMask couldn't connect.

## The Solution ✅

### Fastest Way (One Click):

1. **Double-click:** `setup-dev-environment.bat`
   - Automatically opens all 3 required terminals
   - Starts blockchain, deploys contract, starts React app

---

## Manual Steps (If Preferred):

### Terminal 1 - Start Blockchain:
```
npx hardhat node
```
Keep this running!

### Terminal 2 - Deploy Contract:
```
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address, then update `.env.local`:
```
REACT_APP_CONTRACT_ADDRESS=<PASTE_ADDRESS_HERE>
```

### Terminal 3 - Start App:
```
npm start
```

---

## Files Created:

| File | Purpose |
|------|---------|
| `start-hardhat-node.bat` | Start just the blockchain |
| `deploy-contract.bat` | Deploy the contract |
| `setup-dev-environment.bat` | **One-click setup (recommended)** |
| `RPC_ERROR_FIX.md` | Detailed troubleshooting guide |

---

## 🧪 Test It:

1. Open http://localhost:3000
2. Connect MetaMask to "Localhost 8545"
3. Upload a file
4. Should work without RPC errors!

---

## 🆘 Still Getting Errors?

1. **Check .env.local** - Contract address must be correct
2. **Check Hardhat node terminal** - Make sure it's still running
3. **Restart everything** - Close all 3 terminals and run `setup-dev-environment.bat` again
4. **Read RPC_ERROR_FIX.md** - Full troubleshooting guide

---

**Everything is now set up! Your gasless file sharing app is ready to test.** 🚀
